# 🚀 COPY & PASTE INTO YOUR GPT

## Step 1: Go to Your GPT Configuration
Open: https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5

Click: **Configure** → **Actions** → **Create new action**

---

## Step 2: Authentication Settings

**Authentication Type:** `None` (for now - sandbox doesn't require auth)

_(Later for production, you can add API Key authentication)_

---

## Step 3: Copy This Entire Schema

Click the **Schema** tab in your GPT and paste this ENTIRE JSON:

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "EchoDevo Coach API",
    "description": "TrainingPeaks integration API for EchoDevo Coach GPT - Provides athlete data, workout history, and training metrics for AI coaching analysis",
    "version": "2.0.0",
    "contact": {
      "name": "EchoDevo Support",
      "url": "https://www.echodevo.com"
    }
  },
  "servers": [
    {
      "url": "https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai",
      "description": "EchoDevo Sandbox Environment"
    }
  ],
  "paths": {
    "/api/gpt/fetch": {
      "post": {
        "operationId": "fetchAthleteData",
        "summary": "Fetch athlete training data from TrainingPeaks",
        "description": "Retrieves comprehensive athlete data including workouts, metrics (CTL/ATL/TSB), and wellness data for the specified date range. This is the primary data source for all coaching analysis.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["athlete_id", "start_date", "end_date"],
                "properties": {
                  "athlete_id": {
                    "type": "string",
                    "description": "TrainingPeaks athlete ID",
                    "example": "427194"
                  },
                  "start_date": {
                    "type": "string",
                    "format": "date",
                    "description": "Start date for data fetch (YYYY-MM-DD)",
                    "example": "2026-01-01"
                  },
                  "end_date": {
                    "type": "string",
                    "format": "date",
                    "description": "End date for data fetch (YYYY-MM-DD)",
                    "example": "2026-01-09"
                  },
                  "include_planned": {
                    "type": "boolean",
                    "description": "Include planned (future) workouts",
                    "default": false
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successfully retrieved athlete data",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AthleteDataResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/gpt/write": {
      "post": {
        "operationId": "writeWorkoutPlan",
        "summary": "Write workout plan to TrainingPeaks",
        "description": "Posts prescribed workouts to athlete's TrainingPeaks calendar. Includes workout structure, zones, duration, and coaching notes.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["athlete_id", "workouts"],
                "properties": {
                  "athlete_id": {
                    "type": "string",
                    "description": "TrainingPeaks athlete ID"
                  },
                  "workouts": {
                    "type": "array",
                    "description": "Array of workouts to post",
                    "items": {
                      "$ref": "#/components/schemas/WorkoutPrescription"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Workouts successfully written"
          }
        }
      }
    },
    "/api/gpt/athletes": {
      "get": {
        "operationId": "listAthletes",
        "summary": "List all athletes (Coach Mode)",
        "description": "Returns list of all athletes connected to the coach account. Only available in coach mode.",
        "responses": {
          "200": {
            "description": "List of athletes"
          }
        }
      }
    },
    "/api/gpt/metrics/calculate": {
      "post": {
        "operationId": "calculateMetrics",
        "summary": "Calculate CTL/ATL/TSB from workout history",
        "description": "Computes training stress metrics using EWMA algorithm if not provided by TrainingPeaks. Use this when CTL/ATL/TSB data is missing.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["athlete_id", "workouts"],
                "properties": {
                  "athlete_id": {
                    "type": "string"
                  },
                  "workouts": {
                    "type": "array",
                    "description": "Historical workouts with TSS values",
                    "items": {
                      "type": "object",
                      "properties": {
                        "date": {
                          "type": "string",
                          "format": "date"
                        },
                        "tss": {
                          "type": "number"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Calculated metrics"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AthleteDataResponse": {
        "type": "object",
        "properties": {
          "athlete": {
            "$ref": "#/components/schemas/Athlete"
          },
          "metrics": {
            "$ref": "#/components/schemas/Metrics"
          },
          "workouts": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Workout"
            }
          }
        }
      },
      "Athlete": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "sport": {
            "type": "string"
          },
          "ftp": {
            "type": "number",
            "nullable": true
          },
          "lactate_threshold_hr": {
            "type": "integer",
            "nullable": true
          }
        }
      },
      "Metrics": {
        "type": "object",
        "properties": {
          "ctl": {
            "type": "number"
          },
          "atl": {
            "type": "number"
          },
          "tsb": {
            "type": "number"
          },
          "hrv": {
            "type": "number",
            "nullable": true
          },
          "rhr": {
            "type": "integer",
            "nullable": true
          }
        }
      },
      "Workout": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "format": "date"
          },
          "sport": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "tss": {
            "type": "number"
          },
          "duration": {
            "type": "integer"
          }
        }
      },
      "WorkoutPrescription": {
        "type": "object",
        "required": ["date", "sport", "title", "description", "duration", "tss"],
        "properties": {
          "date": {
            "type": "string",
            "format": "date"
          },
          "sport": {
            "type": "string",
            "enum": ["bike", "run", "swim", "brick", "strength"]
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "duration": {
            "type": "integer"
          },
          "tss": {
            "type": "number"
          }
        }
      }
    }
  }
}
```

---

## Step 4: Privacy Settings (Optional)

If asked about privacy:
- **Privacy Policy URL:** `https://www.echodevo.com/privacy` (or leave blank for testing)
- **Who can access:** Choose based on your preference

---

## Step 5: Test Your GPT

After saving, test with this prompt:

```
List all my athletes
```

**Expected:** Should see 93 athletes

Then test:
```
Analyze athlete 427194 from the last 90 days
```

**Expected:** Should fetch Angela's data with 249 workouts

---

## 🎯 Quick Import Alternative

Instead of copying the schema, you can try importing from URL:

**Import URL:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/gpt/echodevo-openapi.json
```

_(If the import URL doesn't work, use the copy-paste method above)_

---

## ✅ You're Done!

Your GPT now has access to:
- ✅ 93 athletes
- ✅ 249 workouts (90 days for Angela)
- ✅ Sport-specific CTL/ATL/TSB
- ✅ Ability to fetch data
- ✅ Ability to post workouts

**Start coaching! 🏆**
