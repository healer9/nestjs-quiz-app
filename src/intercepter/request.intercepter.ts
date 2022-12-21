import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestIntercepter implements NestInterceptor {

    constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    Logger.log('[Begin]]');

    const request = context.switchToHttp().getRequest(); 
    const path = request.route.path;
    Logger.log(`[Request] : ${path}`);
    const openAPIs = ['/api/v1/users/login', '/api/v1/users/signup'];
    const adminAPIs = ['/api/v1/quiz/create', '/api/v1/users/invite'];
    const memeberAPIs = ['/api/v1/quiz/details', '/api/v1/quiz/next-question', 
    '/api/v1/quiz/start', '/api/v1/users/info'];
    
    if(!openAPIs.includes(path)) {
        try {
            const token = request.headers['auth-token']
            Logger.log(token)
            const payload = this.jwtService.verify(token);
            const role = payload.role;

            // if(role === 'ADMIN' && !adminAPIs.includes(path)) {
            //     Logger.log(path);
            //     throw new UnauthorizedException();
            // }
            Logger.log(`[RequestIntercepter][intercept] Role: ${payload.role}`)
            if(role == 'MEMBER' && !memeberAPIs.includes(path)) {
                Logger.error(path);
                throw new UnauthorizedException();
            }

        } catch (error) {
            Logger.error(path);
            throw new UnauthorizedException();
        }
    }
    

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => Logger.log(`[Completed]... ${Date.now() - now}ms`)),
      );
  }
}