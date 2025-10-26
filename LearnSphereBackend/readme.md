# post /api/student/my-courses

Endpoint
- post http://localhost:4000/api/student/my-courses


Sample req body
```
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWVjODk1MzE2OWU0YTIzZTAwMDQxMyIsInVzZXJuYW1lIjoic3R1ZGVudDEiLCJlbWFpbCI6InN0dWRlbnQxQGdtYWlsLmNvbSIsInJvbGUiOiJTVFVERU5UIiwicHJvZmlsZVBpY3R1cmUiOiJodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS9keWp6ZmtreGwvaW1hZ2UvdXBsb2FkL3YxNzUxMDQyMTg5L2lqeW54ZXhoZ2JyNzFiOGpsemV0LnBuZyIsImNvdXJzZXMiOlsiNjg1ZWM4NTgzMTY5ZTRhMjNlMDAwM2ZhIiwiNjg1ZWM3ZDkzMTY5ZTRhMjNlMDAwM2JmIiwiNjg1ZWNjY2U1NDg2MTcxODUwMTRmM2E1IiwiNjg1ZWNkODQ1NDg2MTcxODUwMTRmNDEyIl0sImlhdCI6MTc2MTQ1NjY2NywiZXhwIjoxNzYxNTQzMDY3fQ.wqb0WpNU-Qz_oLzFDSexR09WNX25gzlSo-6IWUjd39I"
}
```

Sample response
```
{
    "success": true,
    "registeredCourses": [
        {
            "_id": "685ec8583169e4a23e0003fa",
            "title": "Designing",
            "description": "0 to hero",
            "price": 1000,
            "thumbnail": "https://instructor-academy.onlinecoursehost.com/content/images/2020/10/react-2.png",
            "teacher": "685ec83f3169e4a23e0003f2",
            "students": [
                "685ec8953169e4a23e000413",
                "685ee2363c95137e7aaf7109",
                "68e6b5fd59ddd211be31b3c5",
                "68fda54f7c8940009ccf36eb"
            ],
            "status": "APPROVED",
            "demoVideo": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "lessons": [],
            "__v": 4
        },
        {
            "_id": "685ec7d93169e4a23e0003bf",
            "title": "Java",
            "description": "It is A basic to hero Java Course",
            "price": 1000,
            "thumbnail": "https://res.cloudinary.com/dyjzfkkxl/image/upload/v1751041994/fwfypcupqcgwcbzza16i.jpg",
            "teacher": "685ec7543169e4a23e0003b7",
            "students": [
                "685ec8953169e4a23e000413"
            ],
            "status": "APPROVED",
            "demoVideo": "https://res.cloudinary.com/dyjzfkkxl/video/upload/v1751042002/nx0ofeb2ro8dslqc4zcr.mp4",
            "lessons": [],
            "__v": 1
        },
        {
            "_id": "685eccce548617185014f3a5",
            "title": "Math",
            "description": "0 to hero math",
            "price": 1000,
            "thumbnail": "https://res.cloudinary.com/dyjzfkkxl/image/upload/v1751043246/kbzf2turwet0jyefspnt.jpg",
            "teacher": "685ec7543169e4a23e0003b7",
            "students": [
                "685ec8953169e4a23e000413"
            ],
            "status": "APPROVED",
            "demoVideo": "https://res.cloudinary.com/dyjzfkkxl/video/upload/v1751043270/u3msdydus47y99nqub3y.mp4",
            "lessons": [],
            "__v": 1
        },
        {
            "_id": "685ecd84548617185014f412",
            "title": "Physics",
            "description": "ibsdjifhbsdf",
            "price": 1006,
            "thumbnail": "https://instructor-academy.onlinecoursehost.com/content/images/2020/10/react-2.png",
            "teacher": "685ec7543169e4a23e0003b7",
            "students": [
                "685ec8953169e4a23e000413"
            ],
            "status": "APPROVED",
            "demoVideo": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "lessons": [],
            "__v": 1
        }
    ]
}
```

Notes
- 401/403 if token is missing/invalid.
- Replace example JWT with a valid token.
