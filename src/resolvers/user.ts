import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';


@InputType()
class UserPasswordInput {
    @Field()
    username!: string;
    @Field(() => String)
    password!: string;
}


@ObjectType()
class FieldError {
    @Field()
    field!: string;
    @Field()
    message!: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError],{nullable:true})
    errors?: FieldError[]

    @Field(() => User,{nullable: true})
    user?: User
};

@Resolver()
export class UserResolver{
    @Query(() => User, {nullable: true})
    async me(
        @Ctx() {em ,req } : MyContext
    ) {
        //if not logged in
        if(!req.session.userId) {
            return null
        }
        const usr = await em.findOne(User, { id : req.session.userId });
        return usr;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UserPasswordInput) options :  UserPasswordInput,
        @Ctx() {em} : MyContext
    ): Promise<UserResponse> {
        if(options.username.length <= 5) {
            return {
                errors: [{
                    field : "username",
                    message: " The user name cannot be less than 5"
                }]
            }
        }

        if(options.password.length <=8) {
            return {
                errors: [{
                    field:"password",
                    message: "The password needs to atleast 8 characters long"
                }]
            }
        }

        const hashedPasswd =await argon2.hash(options.password)
        const user = em.create(User, {
            userName : options.username,
            password : hashedPasswd,
        });

        try {
            await em.persistAndFlush(user);
        } catch (err) {
            if((err as any).code === '23505'){
                return {
                    errors: [{
                        field: "username",
                        message: "username already taken"
                    }]
                }
            }
        }

        return {
            user
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UserPasswordInput) options : UserPasswordInput,
        @Ctx() {em, req} : MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {userName : options.username });
        if(!user){
            return {
                errors: [{
                    field: "username",
                    message: "User Name doesn't exist!"
                },
              ],
            };
        }
        const valid = await argon2.verify(user.password,options.password);

        if(!valid){
            return {
                errors: [{
                    field: "password", 
                    message: "The password is incorrect"
                },
              ],
            };
        }

        req.session.userId = user.id;

       return {
            user,
       };
    }
    
}