import axiosInstance from '@/api/axiosInstance';
import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia'
import type {  IUserProfile } from '@/interfaces';
import type { ApiResponse } from '@/types/axiosResponce';
import { staticEndpoints } from '@/api/endpoints';
import type { DataFile } from '@/interfaces/index';

export const useProfileStore = defineStore('profileStore', () => {

    // state

    const loadingProfile = ref<boolean>(false);
    const loadingUsers = ref<boolean>(false);
    const createUserPopUp = ref<boolean>(false);
    const createSuperAdmin = ref<boolean>(false);
    const loadingCreating = ref<boolean>(false);

    const userProfile = ref<IUserProfile>({
        email: '',
        role: '',
        username: undefined,
        avatar: undefined,
        avatarFullPath: undefined,
    })

    const userList = ref<IUserProfile[]>([])
    const superAdminList = ref<IUserProfile[]>([])
    // actions

    const fetchUserProfile = async(): Promise<ApiResponse<IUserProfile>> => {
        try {

            loadingProfile.value = true;
            const url = staticEndpoints.user.getProfile

            const response: ApiResponse<IUserProfile> = await axiosInstance.get(url);

            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                userProfile.value = response.data;
                return { success: true, message: response.message, data: response.data };
            }
        }
        finally {
            loadingProfile.value = false;
        }

    }

    const logOutUser = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }


    interface UsersQuery {
        [key: string]: string | number;
    }

    const fetchUsersList = async (params?: UsersQuery):Promise<ApiResponse<IUserProfile[]>> => {
        loadingUsers.value = true;

        const url = staticEndpoints.user.getUsers;

        try {
            const response: ApiResponse<IUserProfile[]> = await axiosInstance.get(url, { params }); // передаєш params сюди
            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                return { success: true, message: response.message, data: response.data };
            }
        } finally {
            loadingUsers.value = false;
        }
    };

    const deleteUser = async (id: string):Promise<ApiResponse<IUserProfile>> => {
        const url = staticEndpoints.user.deleteUser(id);
        try {
            const response : ApiResponse<IUserProfile> = await axiosInstance.delete(url);

            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                return { success: true, message: response.message, data: response.data };
            }

        } finally {

        }
    }

    const updateUser = async (id: string, data: IUserProfile):Promise<ApiResponse<IUserProfile>> => {
        const url = staticEndpoints.user.updateUser(id);

        try {
            const response: ApiResponse<IUserProfile> = await axiosInstance.put(url, { ...data });

            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                return { success: true, message: response.message, data: response.data };
            }

        } finally {

        }
    }


    const updateProfile = async (data: IUserProfile):Promise<ApiResponse<IUserProfile>> => {
        const url = staticEndpoints.user.updateProfile;

        try {
            const response: ApiResponse<IUserProfile> = await axiosInstance.put(url, { ...data });

            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                return { success: true, message: response.message, data: response.data };
            }
        } finally {

        }
    }


    const updateProfilePassWord = async (password: string):Promise<ApiResponse<IUserProfile>> => {
        const url = staticEndpoints.user.updateProfilePassword;

        try {
            const response: ApiResponse<IUserProfile> = await axiosInstance.put(url, { password });

            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                return { success: true, message: response.message, data: response.data };
            }

        } finally {

        }
    }

    const updateUserPassWord = async (data: { id: string, password: string }):Promise<ApiResponse<IUserProfile>> => {
        const { id, password } = data;
        const url = staticEndpoints.user.updatePass(id);

        try {
            const response: ApiResponse<IUserProfile> = await axiosInstance.put(url, { password });

            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                return { success: true, message: response.message, data: response.data };
            }

        } finally {

        }
    }

    const updateProfileAvatar = async (data: DataImage):Promise<ApiResponse<IUserProfile>> => {
        const url = staticEndpoints.user.updateProfileAvatar;

        try {
            const response: ApiResponse<IUserProfile> = await axiosInstance.put(url, { ...data });

            if (response.success === false) {
                return { success: false, message: response.message, data: response.data };
            }
            else {
                return { success: true, message: response.message, data: response.data };
            }

        } finally {

        }
    }

    // getters
    const getUserProfile = computed(() => userProfile.value);
    const getUsersList = computed(() => userList.value)
    const getSuperAdminList = computed(() => superAdminList.value)


    return {
        createUserPopUp,
        createSuperAdmin,
        loadingProfile,
        userProfile,
        getUserProfile,
        fetchUserProfile,
        logOutUser,
        fetchUsersList,
        loadingUsers,
        userList,
        getUsersList,
        superAdminList,
        getSuperAdminList,
        loadingCreating,
        deleteUser,
        updateUser,
        updateProfileAvatar,
        updateProfile,
        updateProfilePassWord,
        updateUserPassWord
    }
  })