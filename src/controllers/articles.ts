
import { Context } from 'koa';
import { pool } from 'src/database';
import { PostAddArticlesParams, PutEditArticlesParams } from 'src/types/articles';

const getArticles = async (ctx: Context) => {
  try {
    const [rows] = await pool.query('select * from articles');
    ctx.body = {
      message: 'Articles fetched successfully',
      data: rows,
    };
  } catch (error: any) {
    ctx.status = 500; // Internal Server Error
    ctx.body = {
      message: 'Error fetching articles',
      error: error.message,
    };
  }
};

const addArticles = async (ctx: Context) => {
  const { title, author, time, remark } = ctx.request.body as PostAddArticlesParams
  try {
    const [result]: any = await pool.execute(
      'INSERT INTO articles (title, author, time, remark) VALUES (?, ?, ?, ?)',
      [title, author, time, remark]
    );
    ctx.status = 200; // Created
    ctx.body = {
      message: 'Articles added successfully',
      id: result?.insertId,
    };
  } catch (error) {
    ctx.status = 500; // Internal Server Error
    ctx.body = {
      message: 'Error adding articles',
      error: (error as Error).message,
    };
  }
};

const _checkIdIsExist = async (id: number | string) => {
  try {
    if (id === "null" || id === "undefined" || !id) {
      return false
    }
    const [articles]: any[] = await pool.execute(`select * from articles where articles_id = ${id}`)
    if (!articles?.length) {
      return false
    }
    return true
  } catch (error) {
    return false
  }
}


const editArticles = async (ctx: Context) => {
  const { title, author, time, remark } = ctx.request.body as PutEditArticlesParams
  const {id} = ctx.params
 
  try {
    const isExist = await _checkIdIsExist(id)
    if (!isExist) {
      ctx.status = 400;
      ctx.body = {
        message: 'id异常，请检查',
        code: 400
      };
      return
    }
    await pool.execute(
      `UPDATE articles SET title=?, author=?, time=?, remark=? WHERE articles_id = ${id}`,
      [title, author, time, remark]
    );
    ctx.status = 200;
    ctx.body = {
      message: 'Articles edit successfully',
      articles_id: id
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      message: 'Error Code 500',
      error: (error as Error).message,
    };
  }
};

const deleteArticles = async (ctx: Context) => {
  const {id} = ctx.params
  try {
    const isExist = await _checkIdIsExist(id)
    if (!isExist) {
      ctx.status = 400;
      ctx.body = {
        message: 'id异常，请检查',
        code: 400
      };
      return
    }
    const [result]: any = await pool.execute(`delete from articles where articles_id = ${id}`)
    console.log('result', result)
    // 检查是否有行被删除
    if (result.affectedRows > 0) {
      ctx.status = 200;
      ctx.body = {
        message: 'Article deleted successfully',
      };
    } else {
      // 如果没有行受到影响，可能是因为没有找到对应的ID
      ctx.status = 404;
      ctx.body = {
        message: 'Error Code 404',
        error: 'Article not found',
      };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      message: 'Error Code 500',
      error: (error as Error).message,
    };
  }
};


export {
  addArticles, deleteArticles, editArticles, getArticles
};
