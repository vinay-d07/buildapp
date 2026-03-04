import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar";

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Tree = ({ item, selectedValue, onSelect, parentPath }) => {
    const { name, type, children } = item;
    const currentPath = parentPath ? `${parentPath}/${name}` : name;

    if (type === "file" || !children || children.length === 0) {
        const isSelected = selectedValue === currentPath;

        return (
            <SidebarMenuButton
                isActive={isSelected}
                className="data-[active=true]:bg-transparent"
                onClick={() => onSelect?.(currentPath)}
            >
                <FileIcon />
                <span className="truncate">{name}</span>
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={false}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRightIcon className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        <FolderIcon />
                        <span className="truncate">{name}</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {children.map((subItem, index) => (
                            <Tree
                                key={index}
                                item={subItem}
                                selectedValue={selectedValue}
                                onSelect={onSelect}
                                parentPath={currentPath}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
};

export const TreeView = ({ data, value, onSelect }) => {
    console.log("data in TreeView", data)
    return (
        <SidebarProvider>
            <Sidebar collapsible="none" className="w-full border-r bg-sidebar">
                <SidebarContent className="p-1">
                    <SidebarGroup className="px-2 py-1">
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-0.5">
                                {data.map((item, index) => (
                                    <Tree
                                        key={index}
                                        item={item}
                                        selectedValue={value}
                                        onSelect={onSelect}
                                        parentPath=""
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
};