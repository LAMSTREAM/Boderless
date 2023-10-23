'use client'

import {useState, ReactNode} from "react";
import Image from "next/image";

export default function ClientTab({len, tabDetail, children}: {len: string, tabDetail:string, children: ReactNode}){
  const [cur, setCur] = useState(`posts`)

  const tabObj: any[] = JSON.parse(tabDetail);

  return (
    <div className={`mt-9`}>
      <div className={`w-full`}>
        <div className={`tab`}>
          {tabObj.map(tab => (
            <div onClick={() => setCur(tab.value)} key={tab.value}
              className={`tab cursor-pointer`} data-state={cur === tab.value ? 'active': ''}>
              <Image
                src={tab.icon}
                alt={tab.label}
                width={24}
                height={24}
                className={`object-contain`}
              />
              <p className={`max-sm:hidden`}>{tab.label}</p>

              {tab.value === 'posts' && (
                <p className={`ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2`}>
                  {len}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          {children}
        </div>
      </div>
    </div>
  )
}