import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role/role.guard';
import { RolesEnum } from 'src/guards/role/role.enum';

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
  @Post('nutrition-recommendations')
  async getNutritionRecommendations(
    @Body() _body: NutritionRecommendationsBodyDto,
  ): Promise<NutritionRecommendationsResDto> {
    return { productIds: [] };
  }
}
