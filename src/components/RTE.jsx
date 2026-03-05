import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import { config } from '../config/config';

export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1 font-[poppins-sb] text-sm text-[var(--color-text-muted)]'>{label}</label>}

            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange } }) => (
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50">
                        <Editor
                            apiKey={config.rteApiKey}
                            initialValue={defaultValue}
                            init={{
                                initialValue: defaultValue,
                                height: 400,
                                menubar: true,
                                skin: 'oxide-dark',
                                content_css: 'dark',
                                plugins: [
                                    "image",
                                    "advlist",
                                    "autolink",
                                    "lists",
                                    "link",
                                    "image",
                                    "charmap",
                                    "preview",
                                    "anchor",
                                    "searchreplace",
                                    "visualblocks",
                                    "code",
                                    "fullscreen",
                                    "insertdatetime",
                                    "media",
                                    "table",
                                    "code",
                                    "help",
                                    "wordcount",
                                    "anchor",
                                ],
                                toolbar:
                                    "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #1e293b; color: #fff; }",
                            }}
                            onEditorChange={onChange}
                        />
                    </div>
                )}
            />
        </div>
    )
}
