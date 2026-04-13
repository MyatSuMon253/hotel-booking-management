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
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useNavigate } from "react-router";
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
import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { GET_ALL_ROOMS_WITHOUT_FILTERS } from "@/graphql/queries/room";
import { CREATE_NEW_ROOM_MUTATION } from "@/graphql/mutations/room";
import { createRoomSchema } from "@/schema/room";

const ROOM_TYPES = ["Single", "Double", "Suite", "Deluxe Double Room"];

const LOCATIONS = ["Yangon", "Mandalay", "Shan", "Bagan"];

function CreateRoom() {
  const naviagte = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const [createNewRoom, { loading }] = useMutation(CREATE_NEW_ROOM_MUTATION, {
    onCompleted() {
      toast.success("Room created.");
      return naviagte("/admin/rooms");
    },
    refetchQueries: [GET_ALL_ROOMS_WITHOUT_FILTERS],
  });

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema) as Resolver<
      z.infer<typeof createRoomSchema>
    >,
    defaultValues: {
      type: "Double",
      roomNumber: "100",
      pricePerNight: 0,
      location: "Yangon",
      isAvailable: true,
      capacity: 0,
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createRoomSchema>) {
    try {
      await createNewRoom({
        variables: {
          roomInput: {
            ...values,
            images,
          },
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(message);
      toast.error(message.includes(":") ? message.split(":")[1] : message);
    }
  }

  return (
    <AdminLayout>
      <Card className="mt-4 mb-10">
        <CardHeader>
          <CardTitle>Create new room</CardTitle>
          <CardDescription>Create new room, you can edit later</CardDescription>
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
                <div className="flex items-center gap-4 mb-4">
                  {images.map((img) => (
                    <div
                      key={img}
                      className="relative w-20 h-20 overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={img}
                        className="rounded-md object-cover "
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
                Create new room
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default CreateRoom;
