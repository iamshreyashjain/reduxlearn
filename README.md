 RTK Query (Best for rapid development)
RTK Query is Redux Toolkit’s built-in powerful data-fetching tool


 RTK Query is a game-changer when it comes to API integration with Redux Toolkit — it gives you automatic caching, re-fetching, loading states, error handling, and even auto-generated hooks.

Let me walk you through how to set it up step by step.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
✅ You're importing:

createApi: the core function to define an API slice.

fetchBaseQuery: a small wrapper around fetch() — acts like Axios, handles GET, POST, etc. You can customize it or replace it with Axios if needed.



export const apiSlice = createApi({})
✅ You're creating and exporting an API slice named apiSlice. This is similar to createSlice in Redux Toolkit, but for API logic (queries, mutations, caching, etc.).

reducerPath: 'api',
✅ This sets the key in the Redux store where RTK Query will store its state (loading, error, data, cache, etc.).


baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
✅ This is the base configuration for all API requests. You're saying:

Every endpoint will start with this base URL.

So when you write query: () => 'users', the real URL becomes:


endpoints: (builder) => ({ })

    builder in endpoints: (builder) => ({ ... })
✅ What is builder?
In RTK Query, builder is a helper object provided inside the endpoints function. It gives you methods like:

builder.query() → for GET requests

builder.mutation() → for POST, PUT, DELETE (i.e., write operations)

STORE:

[authApi.reducerPath]: authApi.reducer, key is in [] square brackets? due to computed value name or anything else and why .reducerpath is added  

What is "middleware" in Redux?
In Redux, middleware sits between your dispatch calls and the reducers. It allows you to:

Intercept actions
Perform async logic (like API calls)
Log actions
Handle caching, retries, etc.

What does getDefaultMiddleware() do?
getDefaultMiddleware() is a function from Redux Toolkit that gives you all the default middleware pre-configured for safety and convenience.

Why do we call .concat(authApi.middleware, userApi.middleware)?
This is where we add RTK Query’s custom middleware to the middleware chain.

RTK Query middleware handles:
API request/response lifecycle

Caching & re-fetching

Background updates

Error handling

DevTools integration

If you don’t add it, RTK Query won’t work properly.


LOGIN: 

const [login, { isLoading, isError, error }] = useLoginMutation(); // RTK Query hook

      const response = await login(login_payloadData).unwrap(); // unwrap gets plain response

🔹 .unwrap()
RTK Query's .unwrap() is a helper that:

Extracts the plain response data (removes the wrapper)

Throws an error automatically if the request fails
(so you can use try/catch like with regular fetch/axios)


Without .unwrap()
If you just write:

const response = await login(login_payloadData);
console.log(response);
You get an object like:

{
  data: { token: "abc123", isSuccess: true },
  meta: {...},
  error: undefined
}



With .unwrap()
This:


const response = await login(login_payloadData).unwrap();
Gives you:


{ token: "abc123", isSuccess: true }


what if I needed to add more API other than login?

Great question! With RTK Query, adding more APIs is very easy and scalable. You have two choices:

// src/features/api/authApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jainsadi.copulaa.com/api/' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => ({
        url: 'AdminProfile/login',
        method: 'POST',
        body: loginData,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    register: builder.mutation({
      query: (registerData) => ({
        url: 'AdminProfile/register',
        method: 'POST',
        body: registerData,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'AdminProfile/logout',
        method: 'POST',
      }),
    }),
  }),
});

// Auto-generated hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;

Now in your components, you can call:
const [register, { isLoading }] = useRegisterMutation();
const [logout] = useLogoutMutation();



 Option 2: Create a new API slice (Recommended if APIs belong to different domains)
Use this when you want to separate logic, like:

authApi for authentication

userApi for user management

productApi for product listings

etc.
Example: Create a userApiSlice.js
js
Copy
Edit
// src/features/api/userApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jainsadi.copulaa.com/api/' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'AdminProfile/allUsers', // example endpoint
    }),
    getUserById: builder.query({
      query: (id) => `AdminProfile/user/${id}`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
} = userApi;
Update store.js to support both slices:
js
Copy
Edit
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/api/authApiSlice';
import { userApi } from '../features/api/userApiSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
});
