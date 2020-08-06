import { prisma } from "../../../../generated/prisma-client"

// 방을 찾고, 없으면 만들고, 메세지 만든다.
export default {
    Mutation: {
        sendMessage: async(_,args,{request,isAuthenticated})=> {
            isAuthenticated(request);
            const {user} = request;
            const {roomId, message, toId} = args;
            //const {message, toId} = args;
            let room;
            let isRoomExisting = await prisma.$exists.room({
                participants_every:{
                    OR: [{
                        id : user.id
                    },
                    {
                        id : toId
                    }
                    ]
                }
            });
            
            if(!isRoomExisting){
                room = await prisma.createRoom({
                    participants: {
                        connect: [{
                            id:toId
                        },
                        {
                            id:user.id
                        }
                        ]
                    }
                });
            }else{
                room= await prisma.room({id: roomId});
            }
            if(!room){
                throw Error("Room not found.");
            }
            const getTo= room.participants.filter(participant => participant.id!==user.id)[0];
            return prisma.createMessage({
                text:message, 
                from:{
                    connect:{
                        id: user.id
                    }
                },
                to:{
                    connect:{
                        id: roomId ? getTo.id : toId 
                    }
                },
                room: {
                    connect: {
                        id: room.id
                    }
                }
            });
        }
    }   
}
