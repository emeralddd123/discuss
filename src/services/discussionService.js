const Discussion = require('../models/discussion')
const User = require('../models/user')
const utils = require('../services/utils')
const mongoose = require('mongoose')

const { getAllReplies } = require('./replyService')

const createDiscussion = async (authorId, discussionData) => {
    try {

        const { heading, description } = discussionData
        const slug = utils.slugIt(heading)

        const newDiscussion = await Discussion.create({
            slug: slug,
            heading: heading,
            description: description,
            author: authorId,
        });
        console.log(`user with id : ${authorId} created a discussion ${newDiscussion._id} succesfully`)
        return { status: 201, message: `discussion Created Succesfully`, discussion: newDiscussion }

    } catch (error) {
        console.error(`Error Occured while user with id: ${authorId} tried to create a discussion \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }
}


const getDiscussions = async (params) => {
    try {
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 20;
        const skip = (page - 1) * limit;
        const search = params.q || '';
        const orderBy = params.orderBy || '-timestamp';

        const searchCriteria = {
            $or: [
                { heading: { $regex: search, $options: 'i' } },
            ]
        }

        const discussions = await Discussion.find(searchCriteria)
            .populate('author', 'username email')
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .exec();

        const total = await Discussion.countDocuments(searchCriteria);

        const totalPage = Math.ceil(total / limit);
        console.log(`discussions fetched Succesfully`)

        return { status: 200, message: `success`, data: { discussions, page, limit, total, totalPage } }

    } catch (error) {
        console.error(error);
        return { status: 500, message: `An Error Occured`, error: error }
    }

}


const getDiscussion = async (idOrSlug) => {
    try {
        let discussion;

        const discussionPopulateOptions = [
            {
                path: 'author',
                select: '_id username email',
            },
            {
                path: 'replies',
                populate: {
                    path: 'author',
                    select: '_id username email',
                },
            },
        ];
        
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            discussion = await Discussion.findOne({
                _id: idOrSlug,
            }).populate(discussionPopulateOptions).exec();
        } else {
            discussion = await Discussion.findOne({
                slug: idOrSlug,
            }).populate(discussionPopulateOptions).exec();
        }

        if (discussion) {
            console.log(`Discussion with idOrSlug: ${idOrSlug} returned Succesfully`)
            return { status: 200, message: `Discussion Fetched Succesfully`, discussion: discussion, author: discussion.author }

        } else {
            console.log(`Discussion with idOrSlug: ${idOrSlug} not Found`)
            return { status: 404, message: `discussion Not Found` }
        }


    } catch (error) {
        console.log(`Error Occured while fetching discussion with id: ${idOrSlug} \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }
}


const getMyDiscussion = async (userId, idOrSlug) => {
    try {
        let discussion;

        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
            discussion = await Discussion.findOne({
                _id: idOrSlug,
                author: userId
            }).populate({
                path: 'author',
                select: '_id username email'
            }).exec();
        } else {
            discussion = await discussion.findOne({
                slug: idOrSlug,
                author: userId
            }).populate({
                path: 'author',
                select: '_id username email'
            })
        }

        if (discussion) {
            const replies = await getAllReplies(discussion.id)
            discussion.replies = replies
            console.log(`discussion with idOrSlug: ${idOrSlug} returned Succesfully`)

            return { status: 200, message: `discussion Fetched Succesfully`, discussion: discussion }

        } else {
            console.log(`discussion with idOrSlug: ${idOrSlug} not Found`)
            return { status: 404, message: `discussion Not Found or doesn't belong to you` }
        }


    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while fetching discussion with id: ${idOrSlug} \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }
}


const updateDiscussion = async (authorId, discussionId, updateData) => {
    try {

        const discussionExist = await Discussion.findOne({ _id: discussionId, author: authorId });

        if (!discussionExist) {
            return { status: 404, message: `discussion with ID ${discussionId} not found or doesn't belong to you` };
        }
        let slug

        if (updateData.heading) {
            slug = utils.slugIt(updateData.heading)
        }

        discussionExist.heading = updateData.heading || discussionExist.heading;
        discussionExist.description = updateData.description || discussionExist.description;
        discussionExist.slug = slug || discussionExist.slug;

        await discussionExist.save();

        console.log(`User with id: ${authorId} updated discussion: ${discussionId} succesfully`)

        return { status: 200, message: 'discussion updated successfully', discussion: discussionExist };

    } catch (error) {
        console.log(`Error Occured while user with id: ${authorId} trying to update discussion: ${discussionId} \n ${error}`)
        return { status: 500, message: 'Error updating the discussion', error };
    }
}


const deleteDiscussion = async (authorId, discussionId) => {
    try {
        const discussion = await Discussion.findOneAndDelete({ author: authorId, _id: discussionId })

        if (!discussion) {
            return { status: 404, message: `discussion with ID ${discussionId} not found or doesn't belong to you` };
        }
        console.log(`User with id: ${authorId} deleted discussion: ${discussionId} succesfully`)

        return { status: 200, message: `discussion with ID ${discussionId}  deleted succesfully`, discussion }

    } catch (error) {
        console.log(`Error Occured while user with id: ${authorId} trying to delete discussion: ${discussionId} \n ${error}`)
        return { status: 500, message: 'Error deleting the discussion', error };
    }
}


async function getMyDiscussions(authorId, params) {
    try {
        const page = parseInt(params.page) || 1
        const limit = parseInt(params.limit) || 20
        const skip = (page - 1) * limit
        const search = params.q || ''
        const orderBy = params.orderBy || '-timestamp'

        const searchCriteria = {
            $or: [
                { heading: { $regex: search, $options: 'i' } },
            ], author: authorId,
        }

        const discussions = await Discussion.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .exec()

        const total = await Discussion.countDocuments(searchCriteria)

        console.log(`user: ${authorId} fetched their discussions Succesfully`)

        return { status: 200, message: `Your Owned discussions fetched succesfully`, data: { discussions, page, limit, total } }

    } catch (error) {
        console.error(error)
        logger.error(`Error Occured while user with id: ${authorId} trying to fetch their discussions \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }

}

const adminDeleteDiscussion = async (discussionId) => {
    try {
        const discussion = await Discussion.findOneAndDelete({ _id: discussionId })

        if (!discussion) {
            return { status: 404, message: `discussion with ID ${discussionId} not found` };
        }
        console.log(`discussion deleted by a moderator`)
        return { status: 200, message: `discussion with ID ${discussionId}  deleted succesfully`, discussion }

    } catch (error) {
        console.log(`Error Occured while trying to delete discussion: ${discussionId} \n ${error}`)
        return { status: 500, message: 'Error deleting the discussion', error };
    }
}

const discussionService = {
    createDiscussion,
    getDiscussions,
    getDiscussion,
    getMyDiscussion,
    getMyDiscussions,
    updateDiscussion,
    deleteDiscussion,
    adminDeleteDiscussion
}


module.exports = discussionService
