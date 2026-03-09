import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role/role.guard';
import { RolesEnum } from 'src/guards/role/role.enum';
import { ProductService } from 'src/modules/product/product.service';
import axios from 'axios';

/** Stub DTO for AI nutrition recommendations request (pet context). */
export class NutritionRecommendationsBodyDto {
  species?: string;
  age?: number;
  weight?: number;
  preExistingConditions?: string;
  petId?: string;
}

/** Stub response: returns empty list until a real AI model is wired. */
export class NutritionRecommendationsResDto {
  productIds: string[];
}

@ApiTags('Member: AI')
@Controller('/member/ai')
@ApiBearerAuth()
@UseGuards(AuthGuard(), RoleGuard)
@Roles([RolesEnum.MEMBER])
export class MemberAiController {
  constructor(private readonly productService: ProductService) {}

  @Post('nutrition-recommendations')
  async getNutritionRecommendations(
    @Body() body: NutritionRecommendationsBodyDto,
  ): Promise<NutritionRecommendationsResDto> {
    // 1) Load product catalog (first 50 products)
    const catalog = await this.productService.findAll({ page: 1, limit: 50 });
    const products = catalog.data ?? [];
    const allIds = products.map((p) => p.id);

    if (!allIds.length) {
      return { productIds: [] };
    }

    // 2) Try AI model if API key is configured; otherwise fall back.
    const apiKey = process.env.SMOLL_AI_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // No AI key configured: do not return fake recommendations
      return { productIds: [] };
    }

    try {
      const systemPrompt =
        'You are an AI nutrition assistant for pets. You must ONLY answer with a JSON array of product IDs from the provided list, no explanation.';

      const productSummary = products
        .map(
          (p) =>
            `- id: ${p.id}, name: ${p.name}, category: ${p.category ?? ''}, price: ${p.price}, description: ${
              p.description ?? ''
            }`,
        )
        .join('\n');

      const userPrompt = `Pet context (may be partial):
${JSON.stringify(body, null, 2)}

Here is the available product catalog:
${productSummary}

Pick up to 5 products that best match the pet's needs. 
Return ONLY a JSON array of product IDs, like:
["id1","id2"]`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      const content: string =
        response.data?.choices?.[0]?.message?.content ?? '[]';

      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        // Some models might wrap JSON in text; try to extract with a simple regex.
        const match = content.match(/\[[\s\S]*\]/);
        parsed = match ? JSON.parse(match[0]) : [];
      }

      const candidateIds = Array.isArray(parsed) ? parsed : [];
      const validIds = candidateIds.filter(
        (id) => typeof id === 'string' && allIds.includes(id),
      );

      // Only return products that were explicitly selected by AI.
      if (!validIds.length) {
        return { productIds: [] };
      }

      return { productIds: validIds.slice(0, 5) };
    } catch {
      // On any AI error, do not fall back to generic products.
      return { productIds: [] };
    }
  }
}
