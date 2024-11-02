"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getBookings } from "@/app/_lib/data-service";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please enter a valid national ID");
  }

  const updateData = { nationality, nationalID, countryFlag };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");
  const id = formData.get("id");
  const updatedFields = { numGuests, observations };

  const guestBookings = await getBookings(session.user.guestId);

  if (!guestBookings.map((booking) => booking.id).includes(Number(id))) {
    throw new Error("You are not allowed to update this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations", "layout");
  redirect("/account/reservations");
}

export async function deleteReservation(id) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);

  if (!guestBookings.map((booking) => booking.id).includes(id)) {
    throw new Error("You are not allowed to delete this booking");
  }

  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    throw new Error("Reservation could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
