import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { Post } from './post.interface';
import PostEntity from './post.entity';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  private lastPostId = 0;
  private posts: Post[] = [
    {
      id: 1,
      title: 'Title One',
      content: 'This is the first post',
    },
  ];

  getAllPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: number): Post {
    const post = this.posts.find((post) => post.id === id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  replacePost(id: number, post: UpdatePostDto): Post {
    const postIdx = this.posts.findIndex((post) => post.id === id);
    if (postIdx > -1) {
      this.posts[postIdx] = post;
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  createPost(post: CreatePostDto): Post {
    const newPost = {
      id: ++this.lastPostId,
      ...post,
    };
    this.posts.push(newPost);
    return newPost;
  }

  deletePost(id: number): any {
    const postIdx = this.posts.findIndex((post) => post.id === id);
    if (postIdx > -1) {
      this.posts.splice(postIdx, 1);
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
