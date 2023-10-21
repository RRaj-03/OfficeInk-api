require('dotenv').config();
const axios = require('axios');

const accessToken =process.env.LINKEDIN_ACCESS_TOKEN; // Replace with your actual access token
const userId = 'abhinav2029'; // Replace with the LinkedIn URN of the user whose posts you want to retrieve
const postCount = 5; // Number of recent posts to retrieve

const getRecentLinkedInPosts = async () => {
  try {
    // Make a GET request to retrieve the user's recent posts
    const response = await axios.get(`https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${userId})&count=${postCount}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Handle the API response and extract post details
    const posts = response.data.elements;

    // Process and use the post data as needed
    posts.forEach((post) => {
      const postId = post.id;
      const postText = post.text;
      const likesCount = post.likes.summary.totalCount;
      const commentsCount = post.comments.summary.totalCount;
      const sharesCount = post.shareCount;

      console.log('Post ID:', postId);
      console.log('Post Text:', postText);
      console.log('Likes Count:', likesCount);
      console.log('Comments Count:', commentsCount);
      console.log('Shares Count:', sharesCount);
      console.log('---');
    });
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error.message);
  }
};

module.exports = getRecentLinkedInPosts;