import createDataContext from './createDataContext'
import jsonServer from '../api/jsonServer'

const blogReducer = (state, action) => {

    switch (action.type) {

        case 'get_blogpost':
            return action.payload
        case 'delete_post':
            return state.filter((blogPost) => {
                return blogPost.id !== action.payload
            }) 
        case 'edit_blogpost':
             return (
                 state.map((blogpost) => {
                    // if (blogpost.id === action.payload.id) {
                    //     return action.payload
                    // } else {
                    //     return blogpost
                    // }
                    return  (blogpost.id === action.payload.id) ? action.payload : blogpost
                 })
             )
        default:
            return state
    }
}

const addBlogPosts = (dispatch) => {
    return async (title, content, callback) => {
        await jsonServer.post('/blogposts', {title, content})
        callback()
    }
}

const deletBlogPost = (dispatch) => {
    return async (id) => {
        await jsonServer.delete(`/blogposts/${id}`)
        dispatch({type: 'delete_post', payload: id})
    }
}

const editBlogPost = (dispatch) => {
    return async (id, title, content, callback) => {
        await jsonServer.put(`/blogposts/${id}`,{title, content})
        dispatch({type: 'edit_blogpost', payload: {id: id, title: title, content: content}})
        callback()
    }
}

const getBlogPost = (dispatch) => {
    return async () => {
        const response =  await jsonServer.get('/blogposts')
        dispatch({type: 'get_blogpost', payload: response.data})
    }
}

export const {Context, Provider} = createDataContext(blogReducer, {addBlogPosts, deletBlogPost, editBlogPost, getBlogPost}, [])