import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";


const statement = {
    action: ["create", "share", "update", "delete", "view"],
    users: ["create", "share", "update", "delete", "view"],
    categories:["create", "update", "delete", "view"],
    products:["create", "update", "delete", "view"],
    coupons:["create", "update", "delete", "view"],
    order:["create", "share", "update", "delete", "view"],
    ...defaultStatements, 


} as const;

const ac = createAccessControl(statement);

export const user = ac.newRole({ 
    action: ["view"], 
    categories:["view"],
    products:["view"],
    users:["view"],

}); 
export const admin = ac.newRole({ 
    action: ["create", "share", "update", "delete", "view"], 
    categories:["create", "update", "delete", "view"],
    products:["create", "update", "delete", "view"],
    coupons:["create", "update", "delete", "view"],
    users:["create", "share", "update", "delete", "view"],
    order:["create", "share", "update", "delete", "view"],

        ...adminAc.statements, 

}); 

export const moderator = ac.newRole({ 
    action: ["create", "update",  "view"], 
    categories:[ "update", "view"],
    products:["update", "view", "create"],
    users:["view","delete"],
    coupons:["view","delete"],
    order:["view","update"],

    ...adminAc.statements, 

}); 



export { ac, statement };