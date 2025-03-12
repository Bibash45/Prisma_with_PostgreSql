import prisma from "../DB/db.config.js";

export const fetchPost = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;
    if (page <= 0) {
        page = 1;
    }
    if (limit <= 0 || limit > 100) {
        limit = 10;
    }

    const skip = (page - 1) * limit


    const posts = await prisma.post.findMany({
        skip: skip,
        take: limit,
        // include: {

        //     // comment: {
        //     //     select: {
        //     //         id: true,
        //     //         comment: true,
        //     //         // Nested include
        //     //         user: {
        //     //             select: {
        //     //                 name: true,
        //     //                 email: true
        //     //             }
        //     //         },
        //     //         // Nested include
        //     //         post: {
        //     //             select: {
        //     //                 id: true,
        //     //                 title: true,
        //     //                 description: true
        //     //             }
        //     //         }
        //     //     }
        //     // },

        // },
        orderBy: {
            id: "desc"
        },
        // where: {

        //     // NOT: {
        //     //     title: {
        //     //         contains: "wow"
        //     //     }
        //     // }
        //     // AND:[
        //     //     {
        //     //         title: {
        //     //             startsWith: "wow"
        //     //         }
        //     //     },
        //     //     {
        //     //         title: {
        //     //             endsWith:"nice"
        //     //         }
        //     //     }
        //     // ],
        //     // OR:[
        //     //     {
        //     //         title: {
        //     //             startsWith: "Hey"
        //     //         }
        //     //     },
        //     //     {
        //     //         title: {
        //     //             startsWith:"wow"
        //     //         }
        //     //     }
        //     // ],
        //     // title:{
        //     //     startsWith:"Hey"
        //     // }
        //     // comment_count: {
        //     //     gte: 0
        //     // }
        // }
    });

    // to get the count of the post
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return res.status(200).json({
        success: true,
        data: posts,
        meta: {
            totalPages,
            currentPage: page,
            limit
        }
    });

}

// Show post
export const showPost = async (req, res) => {
    const postId = req.params.id;
    const post = await prisma.post.findUnique({
        where: {
            id: Number(postId)
        }
    })
    if (!post) {
        return res.status(404).json({
            success: false,
            message: "post not found"
        })
    }
    return res.status(200).json({
        success: true,
        data: post
    })
}

export const createPost = async (req, res) => {
    const {
        user_id,
        title,
        description
    } = req.body;


    const newPost = await prisma.post.create({
        data: {
            user_id: Number(user_id),
            title,
            description
        },
    });

    return res.status(200).json({
        success: true,
        message: "post created successfully",
    });
};

// Update the post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const {
        user_id,
        title,
        description
    } = req.body;

    await prisma.post.update({
        where: {
            id: Number(postId)
        },
        data: {
            user_id: Number(user_id),
            title,
            description
        }
    })

    return res.status(200).json({
        success: true,
        message: "post updated successfully"
    })
}

// Delete the post
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    await prisma.post.delete({
        where: {
            id: Number(postId)
        }
    })
    return res.status(200).json({
        success: true,
        message: "post deleted successfully"
    })
}

//  To search the post
export const searchPost = async (req, res) => {
    try {
        const {
            search
        } = req.query;

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        // Full-text search using PostgreSQL's `tsvector`
        const posts = await prisma.$queryRaw `
        SELECT * FROM "Post"
        WHERE to_tsvector('english', title || ' ' || description)
        @@ plainto_tsquery('english', ${search})
      `;

        return res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};