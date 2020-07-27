export const USER_FRAGMENT= `
    id
    avatar
    username
`
export const COMMENT_FRAGMENT=`
        id
        text
        user{
            ${USER_FRAGMENT}
        }
`;

export const FILE_FRAGMENT=`
        id
        url
`;
export const MESSAGE_FRAGEMENT=`
    id
    text
    to{
        ${USER_FRAGMENT}
    }
    from{
        ${USER_FRAGMENT}
    }
`;

export const ROOM_FRAGMENT=`
    fragment RoomParts on Room {
        id
        participants{
            ${USER_FRAGMENT}
        }
        message{
            ${MESSAGE_FRAGEMENT}
        }
    }
`;
