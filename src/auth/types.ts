export type JwtPayload = {
  sub: number;
  email: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & {
  refreshToken: string | undefined;
};
