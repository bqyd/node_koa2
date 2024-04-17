export interface GetArticlesData {
	id: number;
	title: string;
	author: string;
	time: string;
	remark?: string;
}

export interface PostAddArticlesParams {
	title: string;
	author: string;
	time: string;
	remark?: string;
}

export type PutEditArticlesParams = PostAddArticlesParams
