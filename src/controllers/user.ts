
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { userDB } from 'src/database/user';
import { IRegisterParams } from 'src/types/user';

const accountRegister = async (ctx: Context) => {
  const { username, password } = ctx.request.body as IRegisterParams;
  console.log('username', username)
  const _password = await bcrypt.hash(password, 10); // 使用bcrypt进行密码加密

  // 存储username和hashedPassword到数据库
  // 假设有一个函数addUserToDatabase(username, hashedPassword)
  const userId = await userDB.addAccount(username, _password);
  console.log('userId', userId)
  ctx.status = 201; // Created
  ctx.body = { id: userId, username };
}

const accountLogin = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.split(' ')[1];
  if (!token) {
    ctx.status = 401; // Unauthorized
    return;
  }
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401; // Unauthorized
    ctx.body = { message: "无效的令牌" };
  }
}


export {
  accountLogin, accountRegister
};

