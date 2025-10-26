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
        "685ec8583169e4a23e0003fa",
        "685ec7d93169e4a23e0003bf",
        "685eccce548617185014f3a5",
        "685ecd84548617185014f412"
    ]
}
```

Notes
- 401/403 if token is missing/invalid.
- Replace example JWT with a valid token.
