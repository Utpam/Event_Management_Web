import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../AuthContext/UserAuthContext'
import dbService from '../../../Appwrite/db'
import RTE from '../RTE'

export default function PostForm({ post, clubId }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
            location: post?.location || "",
            registrationEnd: post?.registrationEnd || "",
            startDate: post?.startDate || "",
            endDate: post?.endDate || "",
        },
    });

    const navigate = useNavigate();
    const { user: userData } = useAuth();

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await dbService.uploadFile(data.image[0]) : null;

            if (file) {
                dbService.deleteFile(post.featuredImage);
            }

        } else {
            const file = data.image[0] ? await dbService.uploadFile(data.image[0]) : null;

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;

                delete data.image;
                delete data.slug;

                const dbPost = await dbService.createPost({
                    ...data,
                    userId: userData?.$id,
                    createdBy: userData?.$id, // required in Appwrite schema
                    clubId: clubId || userData?.$id, // fallback to userId if no clubId provided
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string')
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col md:flex-row gap-6 w-full">
            <div className="md:w-2/3 glass-card rounded-2xl p-6 flex flex-col gap-5">
                <h2 className="text-2xl font-[poppins-sb] text-white mb-2">
                    {post ? 'Edit Event Post' : 'Create New Event Post'}
                </h2>

                <div className="flex flex-col gap-1">
                    <label className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Event Title</label>
                    <input
                        placeholder="Enter event title"
                        {...register("title", { required: true })}
                        className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full placeholder:text-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Slug (URL)</label>
                    <input
                        placeholder="event-slug"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                        className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full placeholder:text-slate-500"
                    />
                </div>

                <RTE label="Detailed Description" name="content" control={control} defaultValue={getValues("content")} />
            </div>

            <div className="md:w-1/3 glass-card rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Featured Image</label>
                    <input
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                        className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-2 rounded-xl font-[poppins-lt] outline-none transition-all w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-[poppins-sb] file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-dark)]"
                    />
                    {post && post.featuredImage && (
                        <div className="w-full mt-2 rounded-xl overflow-hidden border border-slate-700">
                            <img
                                src={dbService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Location</label>
                    <input
                        placeholder="Venue or Online Link"
                        {...register("location", { required: true })}
                        className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full placeholder:text-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Start Date & Time</label>
                    <input
                        type="datetime-local"
                        {...register("startDate", { required: true })}
                        className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full min-h-[46px]"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">End Date & Time</label>
                    <input
                        type="datetime-local"
                        {...register("endDate", { required: true })}
                        className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full min-h-[46px]"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Registration Ends</label>
                    <input
                        type="datetime-local"
                        {...register("registrationEnd", { required: true })}
                        className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full min-h-[46px]"
                    />
                </div>

                <button
                    type="submit"
                    className="button w-full py-3 mt-4 text-lg font-bold flex justify-center items-center shadow-lg shadow-[var(--color-primary)]/20"
                >
                    {post ? "Update Post" : "Submit Post"}
                </button>
            </div>
        </form>
    );
}