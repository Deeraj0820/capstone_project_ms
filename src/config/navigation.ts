import {
  MdDashboard,
  MdPeople,
  MdSettings,
  MdBarChart,
  MdPerson,
  MdShoppingCart,
  MdGroup,
  MdWork,
  MdAnalytics,
  MdKeyboardArrowDown,
  MdSecurity,
  MdEmail,
  MdNotifications,
  MdBook,
  MdBookmark,
  MdDetails,
  MdChat,
  MdContacts,
} from "react-icons/md/index.js";

export type NavItem = {
  title: string;
  path: string;
  icon: React.ComponentType;
  children?: NavItem[];
};

export const navigationConfig: Record<string, NavItem[]> = {
  admin: [
    { title: "Dashboard", path: "/dashboard", icon: MdDashboard },
    {
      title: "User Management",
      path: "/dashboard/users",
      icon: MdPeople,
      children: [
        { title: "All Users", path: "/dashboard/users/all", icon: MdGroup },
        { title: "Add User", path: "/dashboard/users/add", icon: MdPerson },
        // { title: "Roles", path: "/dashboard/users/roles", icon: MdSecurity },
      ],
    },
    {title:"Library", path:"/dashboard/library", icon:MdBook},
    {
      title: "Books Management",
      path:"/dashboard/books",
      icon: MdBook,
      children:[
        {title: "All Books", path: "/dashboard/books/all", icon: MdBook}
      ]
    },
    {
      title: "Bookings",
      path:"/dashboard/booking",
      icon: MdBookmark,
      children:[
        {title: "Bookings Details", path: "/dashboard/bookings/all", icon: MdDetails},
        {title: "New Booking", path: "/dashboard/bookings/new", icon: MdBook}
      ]
    },
    // {
    //   title: "Settings",
    //   path: "/dashboard/settings",
    //   icon: MdSettings,
    //   children: [
    //     {
    //       title: "General",
    //       path: "/dashboard/settings/general",
    //       icon: MdSettings,
    //     },
    //     { title: "Email", path: "/dashboard/settings/email", icon: MdEmail },
    //     {
    //       title: "Notifications",
    //       path: "/dashboard/settings/notifications",
    //       icon: MdNotifications,
    //     },
    //   ],
    // },
    { title: "Chat", path: "/dashboard/chat", icon: MdChat },
    { title: "Reports", path: "/dashboard/reports", icon: MdBarChart },
    { title: "Groups", path: "/dashboard/groups", icon: MdBarChart },
    {title:"Contact Deatils", path:"/dashboard/contact/details",icon:MdContacts}
  ],
  user: [
    { title: "Dashboard", path: "/dashboard", icon: MdDashboard },
    { title: "Profile", path: "/dashboard/profile", icon: MdPerson },
    {title:"Library", path:"/dashboard/library", icon:MdBook},
    {
      title: "Books Management",
      path:"/dashboard/books",
      icon: MdBook,
      children:[
        {title: "All Books", path: "/dashboard/books/all", icon: MdBook}
      ]
    },
    // { title: "My Orders", path: "/dashboard/orders", icon: MdShoppingCart },
    {
      title: "Bookings",
      path:"/dashboard/booking",
      icon: MdBookmark,
      children:[
        {title: "Bookings Details", path: "/dashboard/bookings/all", icon: MdDetails},
        // {title: "New Booking", path: "/dashboard/bookings/new", icon: MdBook}
      ]
    },
    { title: "Chats", path: "/dashboard/chat", icon: MdChat },
    { title: "Groups", path: "/dashboard/groups", icon: MdBarChart },
  ],
  manager: [
    { title: "Dashboard", path: "/dashboard", icon: MdDashboard },
    { title: "Team", path: "/dashboard/team", icon: MdGroup },
    { title: "Projects", path: "/dashboard/projects", icon: MdWork },
    { title: "Analytics", path: "/dashboard/analytics", icon: MdAnalytics },
  
  ],
};
