"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import React from "react";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const session = useSession();
  const user = session.data?.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            {/*  */}
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-blue-100">
                Account Profile
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Email Address
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role Section */}
            <div className="flex items-start gap-4 pb-6 border-b">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Account Role
                </p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {user.role || "User"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-600">✓ Active</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p>Your account is fully set up and ready to use</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
