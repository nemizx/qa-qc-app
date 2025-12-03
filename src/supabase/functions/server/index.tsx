import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create storage buckets on startup
const bucketName = 'make-947de7aa-qaqc-photos';
const { data: buckets } = await supabase.storage.listBuckets();
const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
if (!bucketExists) {
  await supabase.storage.createBucket(bucketName, { public: false });
  console.log(`Created bucket: ${bucketName}`);
}

// Initialize default data
const initializeDefaults = async () => {
  // Check if projects exist
  const existingProjects = await kv.get('projects_list');
  if (!existingProjects) {
    const defaultProjects = [
      { id: 'proj_1', name: 'Kohinoor Reina', status: 'Active', completion: 78, createdAt: new Date().toISOString() },
      { id: 'proj_2', name: 'KWT Phase 2', status: 'Active', completion: 62, createdAt: new Date().toISOString() },
      { id: 'proj_3', name: 'KBT', status: 'Active', completion: 91, createdAt: new Date().toISOString() },
      { id: 'proj_4', name: 'KWT Mundhwa', status: 'Active', completion: 45, createdAt: new Date().toISOString() },
    ];
    await kv.set('projects_list', defaultProjects);
    console.log('Initialized default projects');
  }

  // Check if users exist
  const existingUsers = await kv.get('users_list');
  if (!existingUsers) {
    const defaultUsers = [
      { id: 'user_1', name: 'Prasad Kulkarni', role: 'Admin', title: 'Head of QA', email: 'prasad.kulkarni@company.com', createdAt: new Date().toISOString() },
      { id: 'user_2', name: 'Atharva Mane', role: 'Inspector', title: 'QA Engineer', email: 'atharva.mane@company.com', createdAt: new Date().toISOString() },
      { id: 'user_3', name: 'Aryan Patil', role: 'Inspector', title: 'QA Specialist', email: 'aryan.patil@company.com', createdAt: new Date().toISOString() },
    ];
    await kv.set('users_list', defaultUsers);
    console.log('Initialized default users');
  }

  // Check if formats exist
  const existingFormats = await kv.get('formats_list');
  if (!existingFormats) {
    const defaultFormats = [
      { id: 'fmt_1', name: 'Concrete Quality Inspection', category: 'Structural', items: ['Concrete mix design approved', 'Formwork alignment verified', 'Rebar spacing and coverage confirmed'], createdAt: new Date().toISOString() },
      { id: 'fmt_2', name: 'Structural Steel Inspection', category: 'Structural', items: ['Steel grade verification', 'Welding quality inspection', 'Bolt torque verification'], createdAt: new Date().toISOString() },
      { id: 'fmt_3', name: 'Electrical Rough-in', category: 'MEP', items: ['Conduit installation', 'Wire sizing verification', 'Box placement'], createdAt: new Date().toISOString() },
    ];
    await kv.set('formats_list', defaultFormats);
    console.log('Initialized default formats');
  }
};

// Run initialization
await initializeDefaults();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to log all activities
const logActivity = async (userId: string, action: string, entityType: string, entityId: string, details: string) => {
  const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const activity = {
    id: activityId,
    userId,
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString(),
  };
  
  // Get existing activities
  const activities = await kv.get('activities_list') || [];
  await kv.set('activities_list', [activity, ...activities].slice(0, 1000)); // Keep last 1000 activities
  
  return activity;
};

// Health check endpoint
app.get("/make-server-947de7aa/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== PROJECT MANAGEMENT ENDPOINTS =====

// Get all projects
app.get("/make-server-947de7aa/projects", async (c) => {
  try {
    const projects = await kv.get('projects_list') || [];
    return c.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return c.json({ error: 'Failed to get projects: ' + error.message }, 500);
  }
});

// Create project
app.post("/make-server-947de7aa/projects", async (c) => {
  try {
    const body = await c.req.json();
    const { name, status = 'Active' } = body;
    
    const projectId = `proj_${Date.now()}`;
    const project = {
      id: projectId,
      name,
      status,
      completion: 0,
      createdAt: new Date().toISOString(),
    };
    
    const projects = await kv.get('projects_list') || [];
    await kv.set('projects_list', [...projects, project]);
    
    await logActivity('system', 'CREATE', 'project', projectId, `Created project: ${name}`);
    
    return c.json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    return c.json({ error: 'Failed to create project: ' + error.message }, 500);
  }
});

// Update project
app.put("/make-server-947de7aa/projects/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    const projects = await kv.get('projects_list') || [];
    const index = projects.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    projects[index] = { ...projects[index], ...body, updatedAt: new Date().toISOString() };
    await kv.set('projects_list', projects);
    
    await logActivity('system', 'UPDATE', 'project', id, `Updated project: ${projects[index].name}`);
    
    return c.json({ success: true, project: projects[index] });
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Failed to update project: ' + error.message }, 500);
  }
});

// Delete project
app.delete("/make-server-947de7aa/projects/:id", async (c) => {
  try {
    const { id } = c.req.param();
    
    const projects = await kv.get('projects_list') || [];
    const filtered = projects.filter((p: any) => p.id !== id);
    
    if (projects.length === filtered.length) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    await kv.set('projects_list', filtered);
    await logActivity('system', 'DELETE', 'project', id, `Deleted project`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return c.json({ error: 'Failed to delete project: ' + error.message }, 500);
  }
});

// ===== USER MANAGEMENT ENDPOINTS =====

// Get all users
app.get("/make-server-947de7aa/users", async (c) => {
  try {
    const users = await kv.get('users_list') || [];
    return c.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Failed to get users: ' + error.message }, 500);
  }
});

// Create user
app.post("/make-server-947de7aa/users", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, role, title } = body;
    
    const userId = `user_${Date.now()}`;
    const user = {
      id: userId,
      name,
      email,
      role,
      title,
      createdAt: new Date().toISOString(),
    };
    
    const users = await kv.get('users_list') || [];
    await kv.set('users_list', [...users, user]);
    
    await logActivity('system', 'CREATE', 'user', userId, `Created user: ${name}`);
    
    return c.json({ success: true, user });
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ error: 'Failed to create user: ' + error.message }, 500);
  }
});

// Update user
app.put("/make-server-947de7aa/users/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    const users = await kv.get('users_list') || [];
    const index = users.findIndex((u: any) => u.id === id);
    
    if (index === -1) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    users[index] = { ...users[index], ...body, updatedAt: new Date().toISOString() };
    await kv.set('users_list', users);
    
    await logActivity('system', 'UPDATE', 'user', id, `Updated user: ${users[index].name}`);
    
    return c.json({ success: true, user: users[index] });
  } catch (error) {
    console.error('Update user error:', error);
    return c.json({ error: 'Failed to update user: ' + error.message }, 500);
  }
});

// Delete user
app.delete("/make-server-947de7aa/users/:id", async (c) => {
  try {
    const { id } = c.req.param();
    
    const users = await kv.get('users_list') || [];
    const filtered = users.filter((u: any) => u.id !== id);
    
    if (users.length === filtered.length) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    await kv.set('users_list', filtered);
    await logActivity('system', 'DELETE', 'user', id, `Deleted user`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return c.json({ error: 'Failed to delete user: ' + error.message }, 500);
  }
});

// ===== FORMAT MANAGEMENT ENDPOINTS =====

// Get all formats
app.get("/make-server-947de7aa/formats", async (c) => {
  try {
    const formats = await kv.get('formats_list') || [];
    return c.json({ formats });
  } catch (error) {
    console.error('Get formats error:', error);
    return c.json({ error: 'Failed to get formats: ' + error.message }, 500);
  }
});

// Create format
app.post("/make-server-947de7aa/formats", async (c) => {
  try {
    const body = await c.req.json();
    const { name, category, items } = body;
    
    const formatId = `fmt_${Date.now()}`;
    const format = {
      id: formatId,
      name,
      category,
      items,
      createdAt: new Date().toISOString(),
    };
    
    const formats = await kv.get('formats_list') || [];
    await kv.set('formats_list', [...formats, format]);
    
    await logActivity('system', 'CREATE', 'format', formatId, `Created format: ${name}`);
    
    return c.json({ success: true, format });
  } catch (error) {
    console.error('Create format error:', error);
    return c.json({ error: 'Failed to create format: ' + error.message }, 500);
  }
});

// Update format
app.put("/make-server-947de7aa/formats/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    const formats = await kv.get('formats_list') || [];
    const index = formats.findIndex((f: any) => f.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Format not found' }, 404);
    }
    
    formats[index] = { ...formats[index], ...body, updatedAt: new Date().toISOString() };
    await kv.set('formats_list', formats);
    
    await logActivity('system', 'UPDATE', 'format', id, `Updated format: ${formats[index].name}`);
    
    return c.json({ success: true, format: formats[index] });
  } catch (error) {
    console.error('Update format error:', error);
    return c.json({ error: 'Failed to update format: ' + error.message }, 500);
  }
});

// Delete format
app.delete("/make-server-947de7aa/formats/:id", async (c) => {
  try {
    const { id } = c.req.param();
    
    const formats = await kv.get('formats_list') || [];
    const filtered = formats.filter((f: any) => f.id !== id);
    
    if (formats.length === filtered.length) {
      return c.json({ error: 'Format not found' }, 404);
    }
    
    await kv.set('formats_list', filtered);
    await logActivity('system', 'DELETE', 'format', id, `Deleted format`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete format error:', error);
    return c.json({ error: 'Failed to delete format: ' + error.message }, 500);
  }
});

// ===== CHECKLIST MANAGEMENT (MAKER-CHECKER-APPROVER) =====

// Get all checklists
app.get("/make-server-947de7aa/checklists", async (c) => {
  try {
    const checklists = await kv.get('checklists_list') || [];
    return c.json({ checklists });
  } catch (error) {
    console.error('Get checklists error:', error);
    return c.json({ error: 'Failed to get checklists: ' + error.message }, 500);
  }
});

// Get single checklist
app.get("/make-server-947de7aa/checklists/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const checklists = await kv.get('checklists_list') || [];
    const checklist = checklists.find((cl: any) => cl.id === id);
    
    if (!checklist) {
      return c.json({ error: 'Checklist not found' }, 404);
    }
    
    return c.json({ checklist });
  } catch (error) {
    console.error('Get checklist error:', error);
    return c.json({ error: 'Failed to get checklist: ' + error.message }, 500);
  }
});

// Create checklist (Maker)
app.post("/make-server-947de7aa/checklists", async (c) => {
  try {
    const body = await c.req.json();
    const { projectId, formatId, location, makerId, items } = body;
    
    const checklistId = `cl_${Date.now()}`;
    const checklist = {
      id: checklistId,
      projectId,
      formatId,
      location,
      makerId,
      items: items || [], // Array of { text, photoUrl, checked, checkerId, checkerStatus, checkerComments, approverId, approverStatus, approverComments }
      status: 'Draft', // Draft, Submitted, Checking, Checked, Approving, Approved, Rejected
      createdAt: new Date().toISOString(),
      submittedAt: null,
      checkedAt: null,
      approvedAt: null,
    };
    
    const checklists = await kv.get('checklists_list') || [];
    await kv.set('checklists_list', [...checklists, checklist]);
    
    await logActivity(makerId, 'CREATE', 'checklist', checklistId, `Created checklist for project ${projectId}`);
    
    return c.json({ success: true, checklist });
  } catch (error) {
    console.error('Create checklist error:', error);
    return c.json({ error: 'Failed to create checklist: ' + error.message }, 500);
  }
});

// Submit checklist (Maker submits to Checker)
app.post("/make-server-947de7aa/checklists/:id/submit", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { checkerId } = body;
    
    const checklists = await kv.get('checklists_list') || [];
    const index = checklists.findIndex((cl: any) => cl.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Checklist not found' }, 404);
    }
    
    checklists[index] = {
      ...checklists[index],
      checkerId,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    };
    
    await kv.set('checklists_list', checklists);
    await logActivity(checklists[index].makerId, 'SUBMIT', 'checklist', id, `Submitted checklist to checker ${checkerId}`);
    
    return c.json({ success: true, checklist: checklists[index] });
  } catch (error) {
    console.error('Submit checklist error:', error);
    return c.json({ error: 'Failed to submit checklist: ' + error.message }, 500);
  }
});

// Check checklist (Checker reviews)
app.post("/make-server-947de7aa/checklists/:id/check", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { checkerId, items, status, comments } = body; // status: 'Approved' or 'Rejected'
    
    const checklists = await kv.get('checklists_list') || [];
    const index = checklists.findIndex((cl: any) => cl.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Checklist not found' }, 404);
    }
    
    checklists[index] = {
      ...checklists[index],
      items,
      status: status === 'Approved' ? 'Checked' : 'Rejected',
      checkedAt: new Date().toISOString(),
      checkerComments: comments,
    };
    
    await kv.set('checklists_list', checklists);
    await logActivity(checkerId, 'CHECK', 'checklist', id, `Checker ${status === 'Approved' ? 'approved' : 'rejected'} checklist`);
    
    return c.json({ success: true, checklist: checklists[index] });
  } catch (error) {
    console.error('Check checklist error:', error);
    return c.json({ error: 'Failed to check checklist: ' + error.message }, 500);
  }
});

// Submit to approver
app.post("/make-server-947de7aa/checklists/:id/submit-approval", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { approverId } = body;
    
    const checklists = await kv.get('checklists_list') || [];
    const index = checklists.findIndex((cl: any) => cl.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Checklist not found' }, 404);
    }
    
    checklists[index] = {
      ...checklists[index],
      approverId,
      status: 'Approving',
    };
    
    await kv.set('checklists_list', checklists);
    await logActivity(checklists[index].checkerId, 'SUBMIT_APPROVAL', 'checklist', id, `Submitted checklist to approver ${approverId}`);
    
    return c.json({ success: true, checklist: checklists[index] });
  } catch (error) {
    console.error('Submit approval error:', error);
    return c.json({ error: 'Failed to submit for approval: ' + error.message }, 500);
  }
});

// Approve checklist (Approver final approval)
app.post("/make-server-947de7aa/checklists/:id/approve", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { approverId, status, comments } = body; // status: 'Approved' or 'Rejected'
    
    const checklists = await kv.get('checklists_list') || [];
    const index = checklists.findIndex((cl: any) => cl.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Checklist not found' }, 404);
    }
    
    checklists[index] = {
      ...checklists[index],
      status: status === 'Approved' ? 'Approved' : 'Rejected',
      approvedAt: new Date().toISOString(),
      approverComments: comments,
    };
    
    await kv.set('checklists_list', checklists);
    await logActivity(approverId, 'APPROVE', 'checklist', id, `Approver ${status === 'Approved' ? 'approved' : 'rejected'} checklist`);
    
    return c.json({ success: true, checklist: checklists[index] });
  } catch (error) {
    console.error('Approve checklist error:', error);
    return c.json({ error: 'Failed to approve checklist: ' + error.message }, 500);
  }
});

// Update checklist
app.put("/make-server-947de7aa/checklists/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    const checklists = await kv.get('checklists_list') || [];
    const index = checklists.findIndex((cl: any) => cl.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Checklist not found' }, 404);
    }
    
    checklists[index] = { ...checklists[index], ...body, updatedAt: new Date().toISOString() };
    await kv.set('checklists_list', checklists);
    
    await logActivity('system', 'UPDATE', 'checklist', id, `Updated checklist`);
    
    return c.json({ success: true, checklist: checklists[index] });
  } catch (error) {
    console.error('Update checklist error:', error);
    return c.json({ error: 'Failed to update checklist: ' + error.message }, 500);
  }
});

// ===== ACTIVITY LOG ENDPOINTS =====

// Get activity logs
app.get("/make-server-947de7aa/activities", async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '100');
    const activities = await kv.get('activities_list') || [];
    
    return c.json({ activities: activities.slice(0, limit) });
  } catch (error) {
    console.error('Get activities error:', error);
    return c.json({ error: 'Failed to get activities: ' + error.message }, 500);
  }
});

// ===== PHOTO UPLOAD ENDPOINTS =====

// Upload photo endpoint
app.post("/make-server-947de7aa/photos/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    const entityType = formData.get('entityType'); // 'inspection' or 'issue' or 'checklist'
    const entityId = formData.get('entityId');
    const itemIndex = formData.get('itemIndex'); // For checklist items

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${entityType}/${entityId}/${timestamp}.${fileExt}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Upload failed: ' + error.message }, 500);
    }

    // Get signed URL
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600 * 24 * 365); // 1 year expiry

    // Store photo metadata in KV store
    const photoId = `photo_${timestamp}`;
    await kv.set(photoId, {
      id: photoId,
      fileName: file.name,
      path: fileName,
      url: urlData?.signedUrl,
      entityType,
      entityId,
      itemIndex,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type
    });

    // Add photo reference to entity
    const entityKey = `${entityType}_photos_${entityId}`;
    const existingPhotos = await kv.get(entityKey) || [];
    await kv.set(entityKey, [...existingPhotos, photoId]);

    await logActivity('system', 'UPLOAD', 'photo', photoId, `Uploaded photo for ${entityType} ${entityId}`);

    return c.json({ 
      success: true, 
      photoId,
      url: urlData?.signedUrl 
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    return c.json({ error: 'Photo upload failed: ' + error.message }, 500);
  }
});

// Get photos for an entity
app.get("/make-server-947de7aa/photos/:entityType/:entityId", async (c) => {
  try {
    const { entityType, entityId } = c.req.param();
    const entityKey = `${entityType}_photos_${entityId}`;
    
    const photoIds = await kv.get(entityKey) || [];
    const photos = await kv.mget(photoIds);

    // Refresh signed URLs if needed
    const refreshedPhotos = await Promise.all(
      photos.map(async (photo: any) => {
        if (photo) {
          const { data: urlData } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(photo.path, 3600 * 24 * 365);
          return { ...photo, url: urlData?.signedUrl };
        }
        return photo;
      })
    );

    return c.json({ photos: refreshedPhotos.filter(p => p !== null) });
  } catch (error) {
    console.error('Get photos error:', error);
    return c.json({ error: 'Failed to get photos: ' + error.message }, 500);
  }
});

// Delete photo endpoint
app.delete("/make-server-947de7aa/photos/:photoId", async (c) => {
  try {
    const { photoId } = c.req.param();
    const photo = await kv.get(photoId);

    if (!photo) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    // Delete from storage
    await supabase.storage.from(bucketName).remove([photo.path]);

    // Remove from entity's photo list
    const entityKey = `${photo.entityType}_photos_${photo.entityId}`;
    const photoIds = await kv.get(entityKey) || [];
    await kv.set(entityKey, photoIds.filter((id: string) => id !== photoId));

    // Delete metadata
    await kv.del(photoId);

    await logActivity('system', 'DELETE', 'photo', photoId, `Deleted photo from ${photo.entityType} ${photo.entityId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return c.json({ error: 'Failed to delete photo: ' + error.message }, 500);
  }
});

Deno.serve(app.fetch);
