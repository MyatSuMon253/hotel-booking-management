import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRoomSchema } from "@/schema/room";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import {
  DELETE_ROOM_IMAGE_MUTATION,
  UPDATE_ROOM_MUTATION,
} from "@/graphql/mutations/room";
import { GET_ROOM_BY_ID } from "@/graphql/queries/room";
import Loader from "@/components/common/Loader";

const ROOM_TYPES = ["Single", "Double", "Suite", "Deluxe Double Room"];

const LOCATIONS = ["Yangon", "Mandalay", "Shan", "Bagan"];

function UpdateRoom() {
  const naviagte = useNavigate();
  const { id } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema) as Resolver<
      z.infer<typeof createRoomSchema>
    >,
  });

  const {
    data,
    loading: gettingOldData,
    refetch,
  } = useQuery(GET_ROOM_BY_ID, {
    variables: { roomId: id },
  });

  const [deleteRoomImage, { loading: deletingImage }] = useMutation(
    DELETE_ROOM_IMAGE_MUTATION,
    {
      onCompleted: () => {
        refetch();
        toast.success("Image deleted.");
      },
    },
  );

  const [updateRoom, { loading }] = useMutation(UPDATE_ROOM_MUTATION, {
    onCompleted() {
      refetch();
      toast.success("Room updated.");
      return naviagte("/admin/rooms");
    },
  });

  const handleDeleteRoomImage = async (imageId: string) => {
    if (deletingImage) return;
    await deleteRoomImage({
      variables: { roomId: id, imageId },
    });
  };

  const oldData = data?.getRoomById;

  useEffect(() => {
    if (data) {
      const {
        type,
        roomNumber,
        pricePerNight,
        location,
        isAvailable,
        capacity,
        title,
        description,
      } = data?.getRoomById;

      form.reset({
        roomNumber,
        pricePerNight,
        isAvailable,
        capacity,
        title,
        description,
        type,
        location,
      });
    }
  }, [data, form]);

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((pre) => [...pre, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof createRoomSchema>) {
    try {
      await updateRoom({
        variables: {
          roomId: id,
          roomInput: {
            ...values,
            images,
          },
        },
      });
    } catch (err: any) {
      console.log(err.message);
      toast.error(
        err.message.includes(":") ? err.message.split(":")[1] : err.message,
      );
    }
  }

  if (gettingOldData) {
    return <Loader />;
  }

  return (
    <AdminLayout>
      <Card className="mt-4 mb-10">
        <CardHeader>
          <CardTitle>Update existing room</CardTitle>
          <CardDescription>Update the look</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Budget single room" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <h2 className="mb-4">Images</h2>
                {oldData?.images.length > 0 && (
                  <p className="text-sm font-bold mb-4">Existing images</p>
                )}
                <div className="flex items-center gap-4 mb-4 flex-wrap ">
                  {oldData?.images.map(
                    (oldImg: { url: string; public_id: string }) => (
                      <div
                        key={oldImg.public_id}
                        className="relative w-40 h-20 overflow-hidden rounded-md"
                      >
                        <img
                          src={oldImg.url}
                          alt={oldImg.public_id}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/70 p-1 rounded text-red-500"
                          onClick={() =>
                            handleDeleteRoomImage(oldImg.public_id)
                          }
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ),
                  )}
                </div>
                {images.length > 0 && (
                  <p className="text-sm font-bold mb-4 flex-wrap">New images</p>
                )}
                <div className="flex items-center gap-4 mb-4">
                  {images.map((img) => (
                    <div
                      key={img}
                      className="relative w-40 h-20 overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={img}
                        className="rounded-md object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black/70 p-1 rounded text-red-500"
                        onClick={() =>
                          setImages((prev) => prev.filter((i) => i !== img))
                        }
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                >
                  Upload <Upload />
                </Button>
                <Input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleImageInputChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="pricePerNight"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Per night</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Room Type</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          key={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose one" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROOM_TYPES.map((type) => (
                              <SelectItem value={type} key={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          key={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose one" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATIONS.map((loc) => (
                              <SelectItem value={loc} key={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="flex gap-2 items-center text-gray-600">
                        <Checkbox
                          name={field.name}
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ?? false)
                          }
                        />
                        <p>This room is available now.</p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" disabled={loading} type="submit">
                Update room
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default UpdateRoom;
