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
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
