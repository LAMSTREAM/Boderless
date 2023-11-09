import Image from "next/image";
import {ReactNode} from "react";

type Props = {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imageUrl: string;
  bio: string;
  type?: 'User' | 'Community';
  children?: ReactNode;
}

export default function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imageUrl,
  bio,
  type,
  children,
} : Props){

  return (
    <div className={`flex w-full flex-col justify-start`}>
      <div className={`flex items-center justify-between`}>
        <div className={`flex items-center gap-3`}>
          <div className={`relative h-20 w-20 object-cover`}>
            <Image src={imageUrl} alt={`Profile Image`} fill
              className={`rounded-full object-cover shadow-2xl`}/>
          </div>

          <div className={`flex-1`}>
            <h2 className={`text-left text-heading2-bold text-light-2`}>
              {name}
            </h2>
            <p className={`text-base-medium text-gray-1`}>
              @{username}
            </p>
          </div>
        </div>

        {children && (
          <div className={`p-4 h-auto min-w-[74px] rounded-lg bg-primary-500 text-heading4-medium text-light-1 !important`} >
            {children}
          </div>)
        }

      </div>

      <p className={`mt-6 max-w-lg text-base-regular text-light-2`}>
        {bio}
      </p>

      <div className={`mt-12 h-0.5 w-full bg-dark-3`} />
    </div>
  )
}