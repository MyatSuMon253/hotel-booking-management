import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CREATE_BUFFET_DINNER,
  UPDATE_BUFFET_DINNER,
} from "@/graphql/mutations/buffet";
import {
  GET_ALL_BUFFET_DINNERS,
  GET_ALL_DISHES,
  GET_BUFFET_DINNER_BY_ID,
} from "@/graphql/queries/buffet";
import { buffetDinnerSchema } from "@/schema/buffet";
import type { BuffetDinner, Dish } from "@/types/buffet";
import type { z } from "zod";

function BuffetDinnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [facilityInput, setFacilityInput] = useState("");
  const { data: dishData } = useQuery(GET_ALL_DISHES);
  const { data } = useQuery(GET_BUFFET_DINNER_BY_ID, {
    variables: { buffetDinnerId: id },
    skip: !id,
  });
  const [createBuffetDinner, { loading: isCreating }] = useMutation(
    CREATE_BUFFET_DINNER,
    { refetchQueries: [{ query: GET_ALL_BUFFET_DINNERS }] },
  );
  const [updateBuffetDinner, { loading: isUpdating }] = useMutation(
    UPDATE_BUFFET_DINNER,
    { refetchQueries: [{ query: GET_ALL_BUFFET_DINNERS }] },
  );

  const form = useForm<z.infer<typeof buffetDinnerSchema>>({
    resolver: zodResolver(buffetDinnerSchema),
    defaultValues: {
      title: "",
      cuisineCategory: "",
      description: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      includedDishes: [],
      maxCapacity: 1,
      pricePerGuest: 0,
      facilities: [],
      active: true,
    },
  });

  const cuisineCategory = form.watch("cuisineCategory");
  const selectedDishes = form.watch("includedDishes");
  const facilities = form.watch("facilities");
  const dishes = useMemo<Dish[]>(
    () => dishData?.getAllDishes ?? [],
    [dishData],
  );
  const cuisineCategories = useMemo(() => {
    return Array.from(
      new Set(dishes.map((dish) => dish.cuisineCategory)),
    ).sort();
  }, [dishes]);
  const filteredDishes = useMemo(() => {
    if (!cuisineCategory.trim()) {
      return [];
    }
    return dishes.filter(
      (dish) =>
        dish.cuisineCategory.toLowerCase() === cuisineCategory.toLowerCase(),
    );
  }, [cuisineCategory, dishes]);

  useEffect(() => {
    const buffetDinner: BuffetDinner | undefined = data?.getBuffetDinnerById;
    if (buffetDinner) {
      const startsAt = parseDate(buffetDinner.startsAt);
      const endsAt = parseDate(buffetDinner.endsAt);
      form.reset({
        title: buffetDinner.title,
        cuisineCategory: buffetDinner.cuisineCategory,
        description: buffetDinner.description ?? "",
        eventDate: startsAt?.toISOString().slice(0, 10) ?? "",
        startTime: startsAt?.toTimeString().slice(0, 5) ?? "",
        endTime: endsAt?.toTimeString().slice(0, 5) ?? "",
        includedDishes: buffetDinner.includedDishes.map((dish) => dish.id),
        maxCapacity: buffetDinner.maxCapacity,
        pricePerGuest: buffetDinner.pricePerGuest,
        facilities: buffetDinner.facilities ?? [],
        active: buffetDinner.active,
      });
    }
  }, [data, form]);

  const handleDishToggle = (dishId: string) => {
    const nextDishes = selectedDishes.includes(dishId)
      ? selectedDishes.filter((id) => id !== dishId)
      : [...selectedDishes, dishId];
    form.setValue("includedDishes", nextDishes, { shouldValidate: true });
  };

  const handleCuisineChange = (cuisineCategory: string) => {
    form.setValue("cuisineCategory", cuisineCategory, { shouldValidate: true });
    form.setValue("includedDishes", [], { shouldValidate: true });
  };

  const handleAddFacility = () => {
    const value = facilityInput.trim();
    if (!value) return;
    form.setValue("facilities", [...facilities, value]);
    setFacilityInput("");
  };

  const handleRemoveFacility = (facility: string) => {
    form.setValue(
      "facilities",
      facilities.filter((item) => item !== facility),
    );
  };

  const handleSubmit = async (values: z.infer<typeof buffetDinnerSchema>) => {
    const startsAt = new Date(`${values.eventDate}T${values.startTime}`);
    const endsAt = new Date(`${values.eventDate}T${values.endTime}`);
    const buffetDinnerInput = {
      title: values.title,
      cuisineCategory: values.cuisineCategory,
      description: values.description,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      includedDishes: values.includedDishes,
      maxCapacity: values.maxCapacity,
      pricePerGuest: values.pricePerGuest,
      facilities: values.facilities,
      active: values.active,
    };

    try {
      if (isEdit) {
        await updateBuffetDinner({
          variables: { buffetDinnerId: id, buffetDinnerInput },
        });
        toast.success("Buffet dinner updated.");
      } else {
        await createBuffetDinner({ variables: { buffetDinnerInput } });
        toast.success("Buffet dinner created.");
      }
      navigate("/admin/buffet-dinners");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to save buffet dinner.";
      toast.error(message);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            {isEdit ? "Edit Buffet Dinner" : "Create Buffet Dinner"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Set the menu, event time, price, capacity, and facilities.
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6 rounded-md border p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Title</span>
              <Input placeholder="European Night" {...form.register("title")} />
            </label>
            <label className="flex flex-col gap-2">
              <span>Cuisine category</span>
              <select
                className="w-full rounded-md border bg-background px-3 py-2"
                value={cuisineCategory}
                onChange={(event) => handleCuisineChange(event.target.value)}
              >
                <option value="">Select cuisine category</option>
                {cuisineCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <span>Description</span>
            <Textarea
              placeholder="Short dinner description"
              {...form.register("description")}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span>Event date</span>
              <Input type="date" {...form.register("eventDate")} />
            </label>
            <label className="flex flex-col gap-2">
              <span>Start time</span>
              <Input type="time" {...form.register("startTime")} />
            </label>
            <label className="flex flex-col gap-2">
              <span>End time</span>
              <Input type="time" {...form.register("endTime")} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Price per guest</span>
              <Input
                type="number"
                step="0.01"
                {...form.register("pricePerGuest", { valueAsNumber: true })}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Maximum capacity</span>
              <Input
                type="number"
                min={1}
                {...form.register("maxCapacity", { valueAsNumber: true })}
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 rounded-md border p-4">
            <div>
              <h3 className="font-medium">Included dishes</h3>
              <p className="text-sm text-muted-foreground">
                Dishes are filtered by the cuisine category.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredDishes.map((dish) => (
                <label key={dish.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDishes.includes(dish.id)}
                    onChange={() => handleDishToggle(dish.id)}
                  />
                  <span>
                    {dish.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({dish.cuisineCategory})
                    </span>
                  </span>
                </label>
              ))}
              {filteredDishes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Select a cuisine category to choose prerecorded dishes.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="font-medium">Facilities</h3>
            <div className="flex gap-2">
              <Input
                value={facilityInput}
                onChange={(event) => setFacilityInput(event.target.value)}
                placeholder="Live Music"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddFacility}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {facilities.map((facility) => (
                <Button
                  key={facility}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveFacility(facility)}
                >
                  {facility} ×
                </Button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register("active")} />
            <span>Active</span>
          </label>
          <div className="flex gap-3">
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isEdit ? "Save changes" : "Create buffet dinner"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/buffet-dinners")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function parseDate(value: string) {
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default BuffetDinnerForm;
