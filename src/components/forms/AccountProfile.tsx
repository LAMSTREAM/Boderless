'use client'

import * as yup from "yup";
import {useFormik} from "formik";
import Image from "next/image";
import {ChangeEvent, useId, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {usePathname, useRouter} from "next/navigation";

import {isBase64Image} from "@/src/lib/utils";
import {useUploadThing} from "@/src/lib/uploadthing";
import {updateUser} from "@/src/lib/actions/user.action";

interface Props {
  user: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
  },
  btnTitle: string,
}

const schema = yup.object({
  profile_photo: yup.string().url().trim(), //trim for empty test
  name: yup.string().min(3).max(30),
  username: yup.string().min(3).max(30),
  bio: yup.string().min(3).max(1000),
});

export default function AccountProfile({ user, btnTitle }: Props){
  const [files, setFiles] = useState<File[]>([]);
  const {startUpload} = useUploadThing("media");
  const router = useRouter();
  const path = usePathname();

  const imageId = useId();
  const nameId = useId();
  const usernameId = useId();
  const bioId = useId();

  const onSubmit = async (values: any) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if(hasImageChanged){
      const imgRes = await startUpload(files);

      if(imgRes && imgRes[0].fileUrl){
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: path,
    })

    if(path === `/profile/edit`){
      router.back();
    }else{
      router.push('/')
    }
  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const _files = e.target.files
    if(_files && _files.length > 0){
      const _file = _files[0];
      if(!_file.type.includes(`image`)){
        alert('You should upload an image!');
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        formik.values.profile_photo = imageDataUrl;
        setFiles(Array.from(_files));
      }
      fileReader.readAsDataURL(_file);
    }
  };

  const formik = useFormik({
    initialValues: {
      profile_photo: user?.image || '',
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
    validationSchema: schema,
    onSubmit: onSubmit,
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className={`flex flex-col justify-start gap-10`}>
      aria-disabled={formik.isSubmitting}
      <Form.Group className={`flex items-center gap-4`}>
        <Form.Label className={`account-form_image-label`}>
          {formik.values.profile_photo ? (
            <Image
              src={formik.values.profile_photo}
              alt={`profile_icon`}
              width={96}
              height={96}
              priority
              className={`rounded-full object-contain`}
            />
          ) : (
            <Image
              src={`/assets/profile.svg`}
              alt={`profile_icon`}
              width={24}
              height={24}
              className={`object-contain`}
            />
          )}
        </Form.Label>
        <div className={`flex-1 text-base-semibold text-gray-200`}>
          <input
            id={imageId}
            name={`profile_icon`}
            type={`file`}
            placeholder={`Add profile photo`}
            className={`account-form_image-input`}
            onChange={handleImage}
          />
        </div>
      </Form.Group>

      <Form.Group className={`flex w-full flex-col gap-3`}>
        <Form.Label
          htmlFor={nameId}
          className={`text-base-semibold text-light-2`}
        >
          Name
        </Form.Label>
        <Form.Control
          id={nameId}
          type={`text`}
          className={`account-form_input no-focus`}
          //@ts-ignore
          isInvalid={formik.touched.name && formik.errors.name}
          {...formik.getFieldProps(`name`)}
        />
        {formik.touched.name && formik.errors.name ? (
          <Form.Text className={`text-light-2`}>{formik.errors.name}</Form.Text>
        ) : null}
      </Form.Group>

      <Form.Group className={`flex w-full flex-col gap-3`}>
        <Form.Label
          htmlFor={usernameId}
          className={`text-base-semibold text-light-2`}
        >
          Username
        </Form.Label>
        <Form.Control
          id={usernameId}
          type={`text`}
          className={`account-form_input no-focus`}
          //@ts-ignore
          isInvalid={formik.touched.username && formik.errors.username}
          {...formik.getFieldProps(`username`)}
        />
        {formik.touched.username && formik.errors.username ? (
          <Form.Text className={`text-light-2`}>{formik.errors.username}</Form.Text>
        ) : null}
      </Form.Group>

      <Form.Group className={`flex w-full flex-col gap-3`}>
        <Form.Label
          htmlFor={bioId}
          className={`text-base-semibold text-light-2`}
        >
          Bio
        </Form.Label>
        <Form.Control
          id={bioId}
          as={`textarea`}
          rows={5}
          className={`account-form_input no-focus`}
          //@ts-ignore
          isInvalid={formik.touched.bio && formik.errors.bio}
          {...formik.getFieldProps(`bio`)}
        />
        {formik.touched.bio && formik.errors.bio ? (
          <Form.Text className={`text-light-2`}>{formik.errors.bio}</Form.Text>
        ) : null}
      </Form.Group>

      <Button variant={`primary`} type={`submit`} className={`bg-primary-500`}>
        Submit
      </Button>
    </Form>
  )
}