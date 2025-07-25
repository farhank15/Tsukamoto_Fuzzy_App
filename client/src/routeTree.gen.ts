/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as StudentImport } from './routes/student'
import { Route as NotFoundImport } from './routes/not-found'
import { Route as GateImport } from './routes/gate'
import { Route as AdminImport } from './routes/admin'
import { Route as IndexImport } from './routes/index'
import { Route as StudentStatisticsImport } from './routes/student.statistics'
import { Route as StudentFormImport } from './routes/student.form'
import { Route as StudentDashboardImport } from './routes/student.dashboard'
import { Route as GateRegisterImport } from './routes/gate.register'
import { Route as GateLoginImport } from './routes/gate.login'
import { Route as AdminStatisticsImport } from './routes/admin.statistics'
import { Route as AdminListStudentsImport } from './routes/admin.list-students'
import { Route as AdminFuzzyProccessingImport } from './routes/admin.fuzzy-proccessing'
import { Route as AdminDashboardImport } from './routes/admin.dashboard'
import { Route as AdminStudentStudentIdImport } from './routes/admin.student.$studentId'

// Create/Update Routes

const StudentRoute = StudentImport.update({
  id: '/student',
  path: '/student',
  getParentRoute: () => rootRoute,
} as any)

const NotFoundRoute = NotFoundImport.update({
  id: '/not-found',
  path: '/not-found',
  getParentRoute: () => rootRoute,
} as any)

const GateRoute = GateImport.update({
  id: '/gate',
  path: '/gate',
  getParentRoute: () => rootRoute,
} as any)

const AdminRoute = AdminImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const StudentStatisticsRoute = StudentStatisticsImport.update({
  id: '/statistics',
  path: '/statistics',
  getParentRoute: () => StudentRoute,
} as any)

const StudentFormRoute = StudentFormImport.update({
  id: '/form',
  path: '/form',
  getParentRoute: () => StudentRoute,
} as any)

const StudentDashboardRoute = StudentDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => StudentRoute,
} as any)

const GateRegisterRoute = GateRegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => GateRoute,
} as any)

const GateLoginRoute = GateLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => GateRoute,
} as any)

const AdminStatisticsRoute = AdminStatisticsImport.update({
  id: '/statistics',
  path: '/statistics',
  getParentRoute: () => AdminRoute,
} as any)

const AdminListStudentsRoute = AdminListStudentsImport.update({
  id: '/list-students',
  path: '/list-students',
  getParentRoute: () => AdminRoute,
} as any)

const AdminFuzzyProccessingRoute = AdminFuzzyProccessingImport.update({
  id: '/fuzzy-proccessing',
  path: '/fuzzy-proccessing',
  getParentRoute: () => AdminRoute,
} as any)

const AdminDashboardRoute = AdminDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AdminRoute,
} as any)

const AdminStudentStudentIdRoute = AdminStudentStudentIdImport.update({
  id: '/student/$studentId',
  path: '/student/$studentId',
  getParentRoute: () => AdminRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/gate': {
      id: '/gate'
      path: '/gate'
      fullPath: '/gate'
      preLoaderRoute: typeof GateImport
      parentRoute: typeof rootRoute
    }
    '/not-found': {
      id: '/not-found'
      path: '/not-found'
      fullPath: '/not-found'
      preLoaderRoute: typeof NotFoundImport
      parentRoute: typeof rootRoute
    }
    '/student': {
      id: '/student'
      path: '/student'
      fullPath: '/student'
      preLoaderRoute: typeof StudentImport
      parentRoute: typeof rootRoute
    }
    '/admin/dashboard': {
      id: '/admin/dashboard'
      path: '/dashboard'
      fullPath: '/admin/dashboard'
      preLoaderRoute: typeof AdminDashboardImport
      parentRoute: typeof AdminImport
    }
    '/admin/fuzzy-proccessing': {
      id: '/admin/fuzzy-proccessing'
      path: '/fuzzy-proccessing'
      fullPath: '/admin/fuzzy-proccessing'
      preLoaderRoute: typeof AdminFuzzyProccessingImport
      parentRoute: typeof AdminImport
    }
    '/admin/list-students': {
      id: '/admin/list-students'
      path: '/list-students'
      fullPath: '/admin/list-students'
      preLoaderRoute: typeof AdminListStudentsImport
      parentRoute: typeof AdminImport
    }
    '/admin/statistics': {
      id: '/admin/statistics'
      path: '/statistics'
      fullPath: '/admin/statistics'
      preLoaderRoute: typeof AdminStatisticsImport
      parentRoute: typeof AdminImport
    }
    '/gate/login': {
      id: '/gate/login'
      path: '/login'
      fullPath: '/gate/login'
      preLoaderRoute: typeof GateLoginImport
      parentRoute: typeof GateImport
    }
    '/gate/register': {
      id: '/gate/register'
      path: '/register'
      fullPath: '/gate/register'
      preLoaderRoute: typeof GateRegisterImport
      parentRoute: typeof GateImport
    }
    '/student/dashboard': {
      id: '/student/dashboard'
      path: '/dashboard'
      fullPath: '/student/dashboard'
      preLoaderRoute: typeof StudentDashboardImport
      parentRoute: typeof StudentImport
    }
    '/student/form': {
      id: '/student/form'
      path: '/form'
      fullPath: '/student/form'
      preLoaderRoute: typeof StudentFormImport
      parentRoute: typeof StudentImport
    }
    '/student/statistics': {
      id: '/student/statistics'
      path: '/statistics'
      fullPath: '/student/statistics'
      preLoaderRoute: typeof StudentStatisticsImport
      parentRoute: typeof StudentImport
    }
    '/admin/student/$studentId': {
      id: '/admin/student/$studentId'
      path: '/student/$studentId'
      fullPath: '/admin/student/$studentId'
      preLoaderRoute: typeof AdminStudentStudentIdImport
      parentRoute: typeof AdminImport
    }
  }
}

// Create and export the route tree

interface AdminRouteChildren {
  AdminDashboardRoute: typeof AdminDashboardRoute
  AdminFuzzyProccessingRoute: typeof AdminFuzzyProccessingRoute
  AdminListStudentsRoute: typeof AdminListStudentsRoute
  AdminStatisticsRoute: typeof AdminStatisticsRoute
  AdminStudentStudentIdRoute: typeof AdminStudentStudentIdRoute
}

const AdminRouteChildren: AdminRouteChildren = {
  AdminDashboardRoute: AdminDashboardRoute,
  AdminFuzzyProccessingRoute: AdminFuzzyProccessingRoute,
  AdminListStudentsRoute: AdminListStudentsRoute,
  AdminStatisticsRoute: AdminStatisticsRoute,
  AdminStudentStudentIdRoute: AdminStudentStudentIdRoute,
}

const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren)

interface GateRouteChildren {
  GateLoginRoute: typeof GateLoginRoute
  GateRegisterRoute: typeof GateRegisterRoute
}

const GateRouteChildren: GateRouteChildren = {
  GateLoginRoute: GateLoginRoute,
  GateRegisterRoute: GateRegisterRoute,
}

const GateRouteWithChildren = GateRoute._addFileChildren(GateRouteChildren)

interface StudentRouteChildren {
  StudentDashboardRoute: typeof StudentDashboardRoute
  StudentFormRoute: typeof StudentFormRoute
  StudentStatisticsRoute: typeof StudentStatisticsRoute
}

const StudentRouteChildren: StudentRouteChildren = {
  StudentDashboardRoute: StudentDashboardRoute,
  StudentFormRoute: StudentFormRoute,
  StudentStatisticsRoute: StudentStatisticsRoute,
}

const StudentRouteWithChildren =
  StudentRoute._addFileChildren(StudentRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/admin': typeof AdminRouteWithChildren
  '/gate': typeof GateRouteWithChildren
  '/not-found': typeof NotFoundRoute
  '/student': typeof StudentRouteWithChildren
  '/admin/dashboard': typeof AdminDashboardRoute
  '/admin/fuzzy-proccessing': typeof AdminFuzzyProccessingRoute
  '/admin/list-students': typeof AdminListStudentsRoute
  '/admin/statistics': typeof AdminStatisticsRoute
  '/gate/login': typeof GateLoginRoute
  '/gate/register': typeof GateRegisterRoute
  '/student/dashboard': typeof StudentDashboardRoute
  '/student/form': typeof StudentFormRoute
  '/student/statistics': typeof StudentStatisticsRoute
  '/admin/student/$studentId': typeof AdminStudentStudentIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/admin': typeof AdminRouteWithChildren
  '/gate': typeof GateRouteWithChildren
  '/not-found': typeof NotFoundRoute
  '/student': typeof StudentRouteWithChildren
  '/admin/dashboard': typeof AdminDashboardRoute
  '/admin/fuzzy-proccessing': typeof AdminFuzzyProccessingRoute
  '/admin/list-students': typeof AdminListStudentsRoute
  '/admin/statistics': typeof AdminStatisticsRoute
  '/gate/login': typeof GateLoginRoute
  '/gate/register': typeof GateRegisterRoute
  '/student/dashboard': typeof StudentDashboardRoute
  '/student/form': typeof StudentFormRoute
  '/student/statistics': typeof StudentStatisticsRoute
  '/admin/student/$studentId': typeof AdminStudentStudentIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/admin': typeof AdminRouteWithChildren
  '/gate': typeof GateRouteWithChildren
  '/not-found': typeof NotFoundRoute
  '/student': typeof StudentRouteWithChildren
  '/admin/dashboard': typeof AdminDashboardRoute
  '/admin/fuzzy-proccessing': typeof AdminFuzzyProccessingRoute
  '/admin/list-students': typeof AdminListStudentsRoute
  '/admin/statistics': typeof AdminStatisticsRoute
  '/gate/login': typeof GateLoginRoute
  '/gate/register': typeof GateRegisterRoute
  '/student/dashboard': typeof StudentDashboardRoute
  '/student/form': typeof StudentFormRoute
  '/student/statistics': typeof StudentStatisticsRoute
  '/admin/student/$studentId': typeof AdminStudentStudentIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/admin'
    | '/gate'
    | '/not-found'
    | '/student'
    | '/admin/dashboard'
    | '/admin/fuzzy-proccessing'
    | '/admin/list-students'
    | '/admin/statistics'
    | '/gate/login'
    | '/gate/register'
    | '/student/dashboard'
    | '/student/form'
    | '/student/statistics'
    | '/admin/student/$studentId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/admin'
    | '/gate'
    | '/not-found'
    | '/student'
    | '/admin/dashboard'
    | '/admin/fuzzy-proccessing'
    | '/admin/list-students'
    | '/admin/statistics'
    | '/gate/login'
    | '/gate/register'
    | '/student/dashboard'
    | '/student/form'
    | '/student/statistics'
    | '/admin/student/$studentId'
  id:
    | '__root__'
    | '/'
    | '/admin'
    | '/gate'
    | '/not-found'
    | '/student'
    | '/admin/dashboard'
    | '/admin/fuzzy-proccessing'
    | '/admin/list-students'
    | '/admin/statistics'
    | '/gate/login'
    | '/gate/register'
    | '/student/dashboard'
    | '/student/form'
    | '/student/statistics'
    | '/admin/student/$studentId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AdminRoute: typeof AdminRouteWithChildren
  GateRoute: typeof GateRouteWithChildren
  NotFoundRoute: typeof NotFoundRoute
  StudentRoute: typeof StudentRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  GateRoute: GateRouteWithChildren,
  NotFoundRoute: NotFoundRoute,
  StudentRoute: StudentRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/admin",
        "/gate",
        "/not-found",
        "/student"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/admin": {
      "filePath": "admin.tsx",
      "children": [
        "/admin/dashboard",
        "/admin/fuzzy-proccessing",
        "/admin/list-students",
        "/admin/statistics",
        "/admin/student/$studentId"
      ]
    },
    "/gate": {
      "filePath": "gate.tsx",
      "children": [
        "/gate/login",
        "/gate/register"
      ]
    },
    "/not-found": {
      "filePath": "not-found.tsx"
    },
    "/student": {
      "filePath": "student.tsx",
      "children": [
        "/student/dashboard",
        "/student/form",
        "/student/statistics"
      ]
    },
    "/admin/dashboard": {
      "filePath": "admin.dashboard.tsx",
      "parent": "/admin"
    },
    "/admin/fuzzy-proccessing": {
      "filePath": "admin.fuzzy-proccessing.tsx",
      "parent": "/admin"
    },
    "/admin/list-students": {
      "filePath": "admin.list-students.tsx",
      "parent": "/admin"
    },
    "/admin/statistics": {
      "filePath": "admin.statistics.tsx",
      "parent": "/admin"
    },
    "/gate/login": {
      "filePath": "gate.login.tsx",
      "parent": "/gate"
    },
    "/gate/register": {
      "filePath": "gate.register.tsx",
      "parent": "/gate"
    },
    "/student/dashboard": {
      "filePath": "student.dashboard.tsx",
      "parent": "/student"
    },
    "/student/form": {
      "filePath": "student.form.tsx",
      "parent": "/student"
    },
    "/student/statistics": {
      "filePath": "student.statistics.tsx",
      "parent": "/student"
    },
    "/admin/student/$studentId": {
      "filePath": "admin.student.$studentId.tsx",
      "parent": "/admin"
    }
  }
}
ROUTE_MANIFEST_END */
