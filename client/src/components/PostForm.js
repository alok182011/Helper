import React, { useContext, useState } from "react";
import { Image, Form, TextArea, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import "./PostForm.css";

import { AuthContext } from "../context/auth";

function PostForm() {
  const context = useContext(AuthContext);

  const [values, setValues] = useState({
    body: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [createPost, { error }] = useMutation(CREATE_POST, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError(err) {
      console.log(err);
    },
    variables: values,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  return (
    <div className="postform-container">
      <div className="postform-infocard">
        <Image
          className="postform-image"
          size="small"
          src="https://image.freepik.com/free-vector/cute-sheltie-dog-cartoon-icon-illustration-animal-icon-concept-isolated-premium-flat-cartoon-style_138676-1564.jpg"
        />
        <h2>{context.user.username}</h2>
      </div>
      <div className="postform-postform">
        <h2>Let Us Help You :)</h2>

        <Form onSubmit={handleSubmit} noValidate>
          <TextArea
            type="text"
            label="Body"
            name="body"
            value={values.body}
            onChange={handleChange}
            placeholder="Tell us your problem..."
            error={error ? 1 : 0}
            style={{
              minHeight: 150,
              backgroundColor: "lightblue",
              fontSize: 20,
            }}
          />
          <Button
            disabled={!values.body.trim()}
            type="submit"
            className="postform-button"
          >
            Post
          </Button>
        </Form>
        {error && (
          <div className="ui error message">
            <ul className="list">
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        username
        id
      }
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likes {
        username
      }
      comments {
        username
        body
        createdAt
      }
    }
  }
`;

export default PostForm;
