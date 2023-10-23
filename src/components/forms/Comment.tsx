'use client'

import {Button, Form} from "react-bootstrap";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {useId} from "react";
import * as yup from "yup";
import {useFormik} from "formik";

import {createComment} from "@/src/lib/actions/post.actions";

type Props = {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
}

const schema = yup.object({
  comment: yup.string().trim().min(3, {message: 'Minimum 3 characters'}),
})

export default function Comment({
  postId,
  currentUserImg,
  currentUserId,
} : Props){
  const path = usePathname();

  const commentId = useId();

  const onSubmit = async (values: any) => {
    await createComment({
      postId: postId,
      commentText: values.comment,
      userId: currentUserId,
      path: path,
    })

    formik.resetForm();
  }

  const formik = useFormik({
    initialValues: {comment: ''},
    validationSchema: schema,
    onSubmit: onSubmit,
  })

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className={`comment-form`}
      aria-disabled={formik.isSubmitting}
    >
      <Form.Group className={`flex w-full items-center gap-3`}>
        <Form.Label htmlFor={commentId}>
          <Image
            src={currentUserImg}
            alt={`Profile image`}
            width={48} height={48}
            className={`rounded-full object-cover`}
          />
        </Form.Label>
        <Form.Control
          id={commentId}
          type={`text`}
          placeholder={`Comment...`}
          className={`border-none bg-transparent no-focus text-light-1 outline-none w-full p-3`}
          //@ts-ignore
          isInvalid={formik.touched.comment && formik.errors.comment}
          {...formik.getFieldProps('comment')}
        />
      </Form.Group>

      <Button
        type={`submit`}
        className={`comment-form_btn`}
      >
        Reply
      </Button>
    </Form>
  )
}