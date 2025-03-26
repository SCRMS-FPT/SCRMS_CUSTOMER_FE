"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Quote } from "lucide-react"
import { Textarea } from "../ui/textarea"

export function CoachBio({ isEditing, bio, selfIntroduction, onInputChange }) {
  return (
    <Card className="w-full shadow-md border-0 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Quote className="h-5 w-5 text-indigo-600" />
          Giới thiệu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute -left-1 -top-1 text-6xl text-indigo-200">"</div>
          <div className="text-gray-700 relative z-10 pl-6 pr-4 py-2 italic space-y-4">
            {isEditing ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Giới thiệu chuyên môn</label>
                  <Textarea
                    name="bio"
                    value={bio}
                    onChange={onInputChange}
                    className="min-h-[100px] border-indigo-200 focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Giới thiệu cá nhân</label>
                  <Textarea
                    name="selfIntroduction"
                    value={selfIntroduction}
                    onChange={onInputChange}
                    className="min-h-[100px] border-indigo-200 focus:border-indigo-400"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-indigo-700 mb-2 non-italic">Giới thiệu chuyên môn</h3>
                  {bio && <p>{bio}</p>}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-700 mb-2 non-italic">Giới thiệu cá nhân</h3>
                  {selfIntroduction && <p>{selfIntroduction}</p>}
                </div>
              </>
            )}
          </div>
          <div className="absolute -right-1 bottom-0 text-6xl text-indigo-200 rotate-180">"</div>
        </div>
      </CardContent>
    </Card>
  )
}

