import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'
import {jwtDecode} from 'jwt-decode'  

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const {data} = await api.post('/admin-login', info, {
                withCredentials: true
            })
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error){
            return rejectWithValue(error.response.data)
        }
    }
)

export const seller_login = createAsyncThunk(
  'auth/seller_login',
  async (info, {rejectWithValue, fulfillWithValue}) => {
      try{
          const {data} = await api.post('/seller-login', info, {
              withCredentials: true
          })
          console.log(data)
          localStorage.setItem('accessToken', data.token)
          return fulfillWithValue(data)
      } catch (error){
          return rejectWithValue(error.response.data)
      }
  }
)

export const seller_register = createAsyncThunk(
  'auth/seller_register',
  async (info, {rejectWithValue, fulfillWithValue}) => {
      try{
          console.log(info)
          const {data} = await api.post('/seller-register', info, {
              withCredentials: true
          })
          localStorage.setItem('accessToken', data.token)
          return fulfillWithValue(data)
      } catch (error){
          return rejectWithValue(error.response.data)
      }
  }
)

export const profile_image_upload = createAsyncThunk(
  'auth/profile_image_upload',
  async (image, {rejectWithValue, fulfillWithValue}) => {
      try{
          const {data} = await api.post('/profile-image-upload', image, {
              withCredentials: true
          })
          return fulfillWithValue(data)
      } catch (error){
          return rejectWithValue(error.response.data)
      }
  }
)

export const profile_info_add = createAsyncThunk(
  'auth/profile_info_add',
  async (info, {rejectWithValue, fulfillWithValue}) => {
      try{
          const {data} = await api.post('/profile-info-add', info, {
              withCredentials: true
          })
          return fulfillWithValue(data)
      } catch (error){
          return rejectWithValue(error.response.data)
      }
  }
)

export const get_user_info = createAsyncThunk(
  'auth/get_user_info',
  async (_, {rejectWithValue, fulfillWithValue}) => {
      try{
          const {data} = await api.get('/get-user', {
              withCredentials: true
          })
          return fulfillWithValue(data)
      } catch (error){
          return rejectWithValue(error.response.data)
      }
  }
)

const returnRole = (token) => {
  if (token) {
    const decodeToken = jwtDecode(token)
    const expiredTime = new Date(decodeToken.exp * 1000)

    if (new Date() > expiredTime) {
      localStorage.removeItem('accessToken')
      return ''
    } else {
      return decodeToken.role
    }
  } else {
    return ''
  }
}

export const authReducer = createSlice({
  name: 'auth',

  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    userInfo: '',
    role: returnRole(localStorage.getItem('accessToken')),
    token: localStorage.getItem('accessToken')
  },

  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = ""
      state.successMessage = ""
    }
  },

  extraReducers: (builder) => {
    builder.addCase(admin_login.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(admin_login.rejected, (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error
    }); 
    builder.addCase(admin_login.fulfilled, (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token)
    });
    builder.addCase(seller_login.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(seller_login.rejected, (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error
    }); 
    builder.addCase(seller_login.fulfilled, (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token)
    });
    builder.addCase(seller_register.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(seller_register.rejected, (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error
    }); 
    builder.addCase(seller_register.fulfilled, (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.token = payload.token;
      state.role = returnRole(payload.token)
    });
    builder.addCase(get_user_info.fulfilled, (state, { payload }) => {
      state.loader = false;
      state.userInfo = payload.userInfo
    });
    builder.addCase(profile_image_upload.fulfilled, (state, { payload }) => {
      state.successMessage = payload.message;
    });
    builder.addCase(profile_info_add.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(profile_info_add.fulfilled, (state, { payload }) => {
      state.successMessage = payload.message;
    });
  }
})

export const {messageClear} = authReducer.actions
export default authReducer.reducer