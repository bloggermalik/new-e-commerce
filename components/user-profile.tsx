import { ProfileWithUser } from "@/types/type";


export default function UserProfile({ profile }: { profile: ProfileWithUser | null }) {
    return (
        <div>
            <h1>User Profile</h1>
            {profile ? (
                <div>
                    <h2>{profile.user.name}</h2>
                    <p>{profile.user.email}</p>
                    <p>Role: {profile.user.role}</p>
                    <p>Banned: {profile.user.banned ? 'Yes' : 'No'}</p>
                    <p>Bio: {profile.bio}</p>
                    <p>Location: {profile.location}</p>
                    {/* Add more profile fields as needed */}
                </div>
            ) : (
                <p>No profile found</p>
            )}
        </div>
    )
}