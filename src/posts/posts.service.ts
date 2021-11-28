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

  async getAllPosts(): Promise<Post[]> {
    try {
      return await this.postRepository.find();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Cannot find posts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPostById(id: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOne(id);
      if (post) {
        return post;
      }
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Cannot find post with id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePost(id: number, post: UpdatePostDto): Promise<Post> {
    try {
      await this.postRepository.update(id, post);
      const updatedPost = await this.postRepository.findOne(id);
      if (updatedPost) {
        return updatedPost;
      }
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Cannot update post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPost(post: CreatePostDto): Promise<Post> {
    try {
      const newPost = await this.postRepository.create(post);
      await this.postRepository.save(newPost);
      return newPost;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Cannot create new post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePost(id: number): Promise<any> {
    try {
      const deleteResponse = await this.postRepository.delete(id);
      if (!deleteResponse.affected) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Cannot delete post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
