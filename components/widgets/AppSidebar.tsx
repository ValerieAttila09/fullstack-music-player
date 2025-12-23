'use client';

import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { StudioSidebarMenu } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AppSidebar = () => {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <Sidebar>
      <SidebarHeader className='bg-neutral-800 p-10 text-white'>
        <h1 className="text-4xl outfit-semibold">Music</h1>
        <h3 className="text-xl text-neutral-100 outfit-regular">listen & relax with music</h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {StudioSidebarMenu.map((menu: StudioSidebarMenu) => {
                const SidebarIcon = menu.icon;
                const buttonActiveClass = pathname.includes(menu.url) ? 'bg-neutral-800 text-white group hover:text-neutral-200 hover:bg-neutral-700 transition-all' : '';
                const iconAtiveClass = pathname.includes(menu.url) ? 'text-white hover:text-neutral-400 transition-all' : '';
                return (
                  <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton className={`${buttonActiveClass}`} asChild size={'lg'}>
                      <Link href={menu.url}>
                        <SidebarIcon className={`w-6 h-6 ${iconAtiveClass}`} />
                        <span className='text-lg outfit-regular'>{menu.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar