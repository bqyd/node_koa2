import { pool } from "src/database";

class User {
	addAccount = async (username: string, password: string) => {
		try {
			// 使用预处理语句插入新用户
			const [result]: any = await pool.execute(
				"INSERT INTO users (username, password) VALUES (?, ?)",
				[username, password],
			);

			// 返回新插入的用户ID
			return result.insertId;
		} catch (error) {
			console.error("添加用户到数据库时出错：", error);
			throw error; // 抛出错误让调用者处理
		}
	};
}

const userDB = new User();

export {
  userDB
};

