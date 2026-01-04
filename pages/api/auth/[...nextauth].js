import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      // 首次登入時，呼叫後端 API 並取得 JWT token
      if (account && profile) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              google_id: profile.sub,
              email: profile.email,
              name: profile.name,
              picture: profile.picture,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // 將後端返回的資料存入 token
            token.backendUser = data.user;
            token.backendAccessToken = data.tokens.access_token;
            token.backendRefreshToken = data.tokens.refresh_token;
          } else {
            console.error('Backend API error:', await response.text());
          }
        } catch (error) {
          console.error('Error calling backend API:', error);
        }

        // 也保留 Google 的資訊
        token.googleAccessToken = account.access_token;
        token.id = profile.sub;
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      // 將 token 中的資訊傳遞到 session
      session.user.id = token.backendUser?.id || token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.picture = token.picture;
      session.user.phone = token.backendUser?.phone;
      session.user.role = token.backendUser?.role;

      // 將後端的 JWT token 傳遞給前端，用於 API 請求
      session.backendAccessToken = token.backendAccessToken;
      session.backendRefreshToken = token.backendRefreshToken;

      return session;
    },
    async signIn({ account, profile }) {
      // signIn callback 返回 true 表示允許登入
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
