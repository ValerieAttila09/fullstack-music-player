import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { StudioSidebarMenu } from '@/lib/constants'
import Link from 'next/link'

const AppSidebar = () => {
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
                return (
                  <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton asChild size={'lg'}>
                      <Link href={menu.url}>
                        <SidebarIcon className='w-6 h-6 text-neutral-800'/>
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