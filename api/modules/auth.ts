import { axios, extractBodyResolve, POOL_CLIENT, POOL_ID } from "api/client";
import { AuthenticationService, GeneralResponse, TokensResponse } from "@mintoven/common";

let authService: AuthenticationService;

const auth = {
  init(): AuthenticationService {
    if (authService == undefined) {
      authService = new AuthenticationService(POOL_ID, POOL_CLIENT);
    }
    return authService;
  },

  async login(email: string, password: string): Promise<TokensResponse> {
    this.init();
    return authService.signIn(email, password);
  },

  async register(data: any) {
    return extractBodyResolve(axios.post("/user", data));
  },

  async logout(): Promise<GeneralResponse> {
    this.init();
    return authService.signOut()
  },

  async forgotPassword(email: string): Promise<GeneralResponse> {
    this.init();
    return authService.forgotPassword(email);
  },

  async confirmPassword(code: string, password: string): Promise<GeneralResponse> {
    this.init();
    return authService.confirmPassword(code, password);
  },

  async resetPassword(email: string, currentPassword: string, newPassword: string): Promise<GeneralResponse> {
    this.init();
    return authService.changePassword(currentPassword, newPassword)
  },

  async verifyEmail(email: string, verificationCode: string): Promise<GeneralResponse> {
    this.init();
    return authService.verifyUser(email, verificationCode);
  },

  async verifyEmailResend(email: string): Promise<GeneralResponse> {
    this.init();
    return authService.resendVerification(email);
  },

  async getTokens(): Promise<TokensResponse> {
    this.init();
    return authService.getAccessToken();
  },
};

export default auth;
