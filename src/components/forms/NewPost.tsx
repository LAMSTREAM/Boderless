'use client'

import * as yup from "yup";
import {useFormik} from "formik";
import {useId} from "react";
import {Button, Form} from "react-bootstrap";
import {useOrganization} from "@clerk/nextjs";
import {usePathname, useRouter} from "next/navigation";

import {createPost} from "@/src/lib/actions/post.actions";

const schema = yup.object({
  post: yup.string().trim().min(3, {message: 'Minimum 3 characters'}),
  accountId: yup.string(),
});

function NewPost({ userId }: {userId: string}){
  const router = useRouter();
  const path = usePathname();
  const {organization} = useOrganization();

  const postId = useId();

  const onSubmit = async (values: any) => {
    await createPost({
      text: values.post,
      author: userId,
      communityId: organization?.id || null,
      path: path,
    });

    router.push('/')
  }

  const formik = useFormik({
    initialValues: {
      post: '',
      accountId: userId,
    },
    validationSchema: schema,
    onSubmit: onSubmit,
  })

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className={`mt-10 flex flex-col justify-start gap-10`}
      aria-disabled={formik.isSubmitting}
    >
      <Form.Group className={`flex w-full flex-col gap-3`}>
        <Form.Label
          htmlFor={postId}
          className={`text-base-semibold text-light-2`}>
          Content
        </Form.Label>
        <Form.Control
          id={postId}
          as={`textarea`}
          rows={15}
          className={`no-focus border border-dark-4 bg-dark-3 text-light-1`}
          //@ts-ignore
          isInvalid={formik.touched.post && formik.errors.post}
          {...formik.getFieldProps('post')}
        />
        {formik.touched.post && formik.errors.post ? (
          <Form.Text>{formik.errors.post}</Form.Text>
        ) : null}
      </Form.Group>

      <Button
        type={`submit`}
        className={`bg-primary-500`}
      >
        Post
      </Button>
    </Form>
  );
}

export default NewPost;