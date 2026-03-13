#!/bin/bash

# ============================================================
#  Taskboard - Quick Health Check Script
#  Run this after starting the app to verify everything works
# ============================================================

BACKEND="http://localhost:5000/api"
FRONTEND="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
PASS=0
FAIL=0

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Taskboard - Application Tests        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Helper functions
check() {
  local label=$1
  local result=$2
  if [ "$result" = "PASS" ]; then
    echo -e "  ${GREEN}✅ PASS${NC}  $label"
    ((PASS++))
  else
    echo -e "  ${RED}❌ FAIL${NC}  $label  ${RED}← $result${NC}"
    ((FAIL++))
  fi
}

http_get() {
  curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$1" 2>/dev/null
}

http_body() {
  curl -s --connect-timeout 5 "$1" 2>/dev/null
}

http_post() {
  curl -s -X POST "$1" \
    -H "Content-Type: application/json" \
    -d "$2" \
    --connect-timeout 5 2>/dev/null
}

http_delete() {
  curl -s -X DELETE "$1" --connect-timeout 5 2>/dev/null
}

# ── 1. Backend Health ────────────────────────────────────────
echo -e "${YELLOW}▸ Backend Health${NC}"

BACKEND_STATUS=$(http_get "$BACKEND/health")
[ "$BACKEND_STATUS" = "200" ] && check "Backend is running on port 5000" "PASS" || check "Backend is running on port 5000" "Got HTTP $BACKEND_STATUS (expected 200)"

HEALTH=$(http_body "$BACKEND/health")
echo "$HEALTH" | grep -q '"status":"healthy"' && check "Health endpoint returns 'healthy'" "PASS" || check "Health endpoint returns 'healthy'" "Unexpected response: $HEALTH"

echo "$HEALTH" | grep -q '"database":"connected"' && check "Database is connected to MongoDB" "PASS" || check "Database is connected to MongoDB" "Database not connected - check MongoDB is running"

echo ""

# ── 2. Frontend Health ───────────────────────────────────────
echo -e "${YELLOW}▸ Frontend Health${NC}"

STATUS=$(http_get "$FRONTEND")
[ "$STATUS" = "200" ] && check "Frontend is running on port 3000" "PASS" || check "Frontend is running on port 3000" "Got HTTP $STATUS (expected 200)"

BODY=$(http_body "$FRONTEND")
echo "$BODY" | grep -qi "taskboard\|task manager\|react" && check "Frontend HTML loads correctly" "PASS" || check "Frontend HTML loads correctly" "Unexpected HTML content"

echo ""

# ── 3. API - Create Task ─────────────────────────────────────
echo -e "${YELLOW}▸ API - Task CRUD Operations${NC}"

CREATE=$(http_post "$BACKEND/tasks" '{"title":"Test Task from Script","priority":"high","category":"work","tags":["test"]}')
echo "$CREATE" | grep -q '"success":true' && check "POST /tasks - create a task" "PASS" || check "POST /tasks - create a task" "Response: $CREATE"

TASK_ID=$(echo "$CREATE" | sed 's/.*"_id":"\([^"]*\)".*/\1/')
[ -n "$TASK_ID" ] && check "Task was saved with a MongoDB _id" "PASS" || check "Task was saved with a MongoDB _id" "Could not extract _id from response"

echo "$CREATE" | grep -q '"priority":"high"' && check "Task priority saved correctly" "PASS" || check "Task priority saved correctly" "Priority mismatch in response"

echo "$CREATE" | grep -q '"category":"work"' && check "Task category saved correctly" "PASS" || check "Task category saved correctly" "Category mismatch in response"

# ── 4. API - Read Tasks ──────────────────────────────────────
LIST=$(http_body "$BACKEND/tasks")
echo "$LIST" | grep -q '"success":true' && check "GET /tasks - list all tasks" "PASS" || check "GET /tasks - list all tasks" "Response: $LIST"

echo "$LIST" | grep -q '"Test Task from Script"' && check "Created task appears in task list" "PASS" || check "Created task appears in task list" "Task not found in list"

echo "$LIST" | grep -q '"total"' && check "Pagination data returned in response" "PASS" || check "Pagination data returned in response" "No pagination in response"

# ── 5. API - Filtering ───────────────────────────────────────
FILTERED=$(http_body "$BACKEND/tasks?priority=high&completed=false")
echo "$FILTERED" | grep -q '"success":true' && check "GET /tasks?priority=high&completed=false - filter works" "PASS" || check "Filter endpoint works" "Response: $FILTERED"

SEARCH=$(http_body "$BACKEND/tasks?search=Test+Task+from+Script")
echo "$SEARCH" | grep -q '"Test Task from Script"' && check "GET /tasks?search= - search by title works" "PASS" || check "Search endpoint works" "Task not found in search results"

# ── 6. API - Stats ───────────────────────────────────────────
STATS=$(http_body "$BACKEND/tasks/stats")
echo "$STATS" | grep -q '"success":true' && check "GET /tasks/stats - stats endpoint works" "PASS" || check "Stats endpoint works" "Response: $STATS"

echo "$STATS" | grep -q '"total"' && check "Stats contains total count" "PASS" || check "Stats contains total count" "Missing 'total' in stats"

echo "$STATS" | grep -q '"completionRate"' && check "Stats contains completion rate" "PASS" || check "Stats contains completion rate" "Missing 'completionRate' in stats"

# ── 7. API - Toggle ──────────────────────────────────────────
if [ -n "$TASK_ID" ]; then
  TOGGLE=$(curl -s -X PATCH "$BACKEND/tasks/$TASK_ID/toggle" --connect-timeout 5)
  echo "$TOGGLE" | grep -q '"completed":true' && check "PATCH /tasks/:id/toggle - marks task complete" "PASS" || check "Toggle task complete" "Response: $TOGGLE"

  TOGGLE2=$(curl -s -X PATCH "$BACKEND/tasks/$TASK_ID/toggle" --connect-timeout 5)
  echo "$TOGGLE2" | grep -q '"completed":false' && check "PATCH /tasks/:id/toggle (again) - unmarks task" "PASS" || check "Toggle task back" "Response: $TOGGLE2"
fi

# ── 8. API - Update ──────────────────────────────────────────
if [ -n "$TASK_ID" ]; then
  UPDATE=$(curl -s -X PUT "$BACKEND/tasks/$TASK_ID" \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated Task Title","priority":"low"}' \
    --connect-timeout 5)
  echo "$UPDATE" | grep -q '"Updated Task Title"' && check "PUT /tasks/:id - update task title" "PASS" || check "Update task" "Response: $UPDATE"
  echo "$UPDATE" | grep -q '"priority":"low"' && check "PUT /tasks/:id - update task priority" "PASS" || check "Update priority" "Response: $UPDATE"
fi

# ── 9. API - Delete ──────────────────────────────────────────
if [ -n "$TASK_ID" ]; then
  DELETE=$(curl -s -X DELETE "$BACKEND/tasks/$TASK_ID" --connect-timeout 5)
  echo "$DELETE" | grep -q '"success":true' && check "DELETE /tasks/:id - delete the test task" "PASS" || check "Delete task" "Response: $DELETE"

  VERIFY=$(http_get "$BACKEND/tasks/$TASK_ID")
  [ "$VERIFY" = "404" ] && check "Deleted task returns 404 when fetched again" "PASS" || check "Deleted task returns 404" "Got HTTP $VERIFY (expected 404)"
fi

# ── 10. API - Validation ─────────────────────────────────────
echo ""
echo -e "${YELLOW}▸ API - Input Validation${NC}"

BAD1=$(http_post "$BACKEND/tasks" '{}')
echo "$BAD1" | grep -q '"success":false' && check "POST with no title returns 400 error" "PASS" || check "Reject empty title" "Response: $BAD1"

BAD2=$(http_post "$BACKEND/tasks" '{"title":"Test","priority":"urgent"}')
echo "$BAD2" | grep -q '"success":false' && check "POST with invalid priority returns 400 error" "PASS" || check "Reject invalid priority" "Response: $BAD2"

BAD3=$(http_get "$BACKEND/tasks/not-a-real-id")
[ "$BAD3" = "400" ] && check "GET with invalid ObjectId returns 400 error" "PASS" || check "Reject invalid ObjectId" "Got HTTP $BAD3 (expected 400)"

BAD4=$(http_get "$BACKEND/tasks/000000000000000000000000")
[ "$BAD4" = "404" ] && check "GET non-existent task returns 404 error" "PASS" || check "Non-existent task returns 404" "Got HTTP $BAD4 (expected 404)"

# ── Summary ──────────────────────────────────────────────────
TOTAL=$((PASS + FAIL))
echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "  Results: ${GREEN}$PASS passed${NC} / ${RED}$FAIL failed${NC} / $TOTAL total"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

if [ "$FAIL" -eq 0 ]; then
  echo -e "  ${GREEN}🎉 All tests passed! App is working correctly.${NC}"
else
  echo -e "  ${RED}⚠️  $FAIL test(s) failed. Check the errors above.${NC}"
  echo ""
  echo -e "  ${YELLOW}Troubleshooting:${NC}"
  echo "  • MongoDB not running?  →  docker run -d -p 27017:27017 mongo:7.0"
  echo "  • Backend not started?  →  cd backend && npm run dev"
  echo "  • Frontend not started? →  cd frontend && npm start"
  echo "  • Using Docker Compose? →  docker-compose up --build"
fi

echo ""
