import { EditProfile } from "../props/editprofileprop";

export const queryUpdateData = async (profile: EditProfile) => {
    const query = { ...profile };
    delete query.id;
    delete query.userid;
    delete query.email;
    
    return query;
}