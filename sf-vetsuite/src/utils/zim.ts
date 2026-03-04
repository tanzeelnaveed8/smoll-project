import type { User } from '@/stores/types/auth'
import { ZegoExpressEngine } from 'zego-express-engine-webrtc'
import { ZIM, ZIMErrorCode, type ZIMLoginConfig } from 'zego-zim-web'

const ZIM_INFO = {
  appId: import.meta.env.VITE_ZIM_APP_ID,
  serverKey: import.meta.env.VITE_ZIM_SERVER_KEY
}

export class ZimHelper {
  static zim: ZIM
  static zg: ZegoExpressEngine

  //INITIALIZATION
  static async init(user: User, zegoToken: string) {
    // Create a ZIM instance
    ZIM.create({ appID: parseInt(ZIM_INFO.appId) })
    const zim = ZIM.getInstance()

    this.zim = zim

    // Configure login parameters
    const config: ZIMLoginConfig = {
      userName: user.name,
      token: zegoToken,
      isOfflineLogin: false
    }

    // Login to ZIM
    try {
      await zim.login(user.id, config)
      // Update user avatar URL
      if (user.profileImg) {
        await zim.updateUserAvatarUrl(user.profileImg?.url)
      }
    } catch (error: unknown) {
      if ((error as { code?: number })?.code === 6000106) {
        throw new Error('INVALID_TOKEN')
      }

      throw error
    }
  }

  static initCall(zegoToken: string) {
    const zg = new ZegoExpressEngine(parseInt(ZIM_INFO.appId), ZIM_INFO.serverKey, {
      scenario: 4
    })
    this.zg = zg
  }

  static async getUserExtendedData(userID: string) {
    try {
      const { userList } = await this.zim.queryUsersInfo([userID], {
        isQueryFromServer: true
      })

      if (userList.length > 0) {
        return userList[0].extendedData
      }

      return null
    } catch (error) {
      console.error('Failed to get user extended data:', error)
      throw error
    }
  }

  //LOGOUT
  static logout() {
    this.zim.logout()
    this.zim.destroy()
  }
}
