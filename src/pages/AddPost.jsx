import React from 'react'
import { useParams } from 'react-router-dom'
import PostForm from '../components/PostForm/postform'

function AddPost() {
    const { id: clubId } = useParams();

    return (
        <div className='py-8 w-full block'>
            <PostForm clubId={clubId} />
        </div>
    )
}

export default AddPost
