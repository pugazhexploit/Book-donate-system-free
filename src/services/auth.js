import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from './store';

export const authService = {
  // Login with Supabase or Mock
  async login(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Fetch profile
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profError) throw profError;
      return { user: { ...data.user, ...profile } };
    }

    // Local Mock Mode
    const profiles = localStore.getProfiles();
    const found = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('Invalid email or password. (Demo students: pugazh@college.edu or arun@college.edu, Admin: admin@college.edu)');
    }
    localStore.saveSession(found);
    return { user: found };
  },

  // Student Registration
  async register({ full_name, email, password, phone, register_number, department, year, semester }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, department, register_number }
        }
      });
      if (error) throw error;

      // Create profile row in Supabase
      const newProfile = {
        id: data.user.id,
        full_name,
        email,
        phone,
        register_number,
        department,
        year: year || '1st Year',
        semester: semester || 'Semester 1',
        role: 'student',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
        bio: 'College student sharing academic resources.',
        created_at: new Date().toISOString()
      };

      const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
      if (insertError) throw insertError;

      return { user: newProfile };
    }

    // Local Mock Mode
    const profiles = localStore.getProfiles();
    if (profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('A student with this email is already registered.');
    }
    if (register_number && profiles.some(p => p.register_number?.toLowerCase() === register_number.toLowerCase())) {
      throw new Error('Register number already exists.');
    }

    const newProfile = {
      id: 'user-' + Date.now(),
      full_name,
      email,
      phone: phone || '',
      register_number: register_number || 'REG' + Math.floor(1000 + Math.random() * 9000),
      department: department || 'B.Sc Computer Science',
      year: year || '1st Year',
      semester: semester || 'Semester 1',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
      bio: 'Excited to be part of the book donation network.',
      role: 'student',
      created_at: new Date().toISOString(),
      stats: { booksDonated: 0, studentsHelped: 0, booksReceived: 0, completedDonations: 0 }
    };

    profiles.push(newProfile);
    localStore.saveProfiles(profiles);
    localStore.saveSession(newProfile);
    localStore.addLog('REGISTER_STUDENT', 'student', `${full_name} joined the Book Donation System`, full_name, 'blue');

    return { user: newProfile };
  },

  // Admin Login
  async adminLogin(email, password) {
    const result = await this.login(email, password);
    if (result.user.role !== 'admin') {
      throw new Error('Unauthorized. This portal is strictly restricted to Academic Staff / Admins.');
    }
    return result;
  },

  // Logout
  async logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStore.saveSession(null);
  },

  // Quick Demo Login (for hassle-free testing)
  async quickLoginAs(userType = 'pugazh') {
    const profiles = localStore.getProfiles();
    let target = null;
    if (userType === 'pugazh') target = profiles.find(p => p.email === 'pugazh@college.edu');
    else if (userType === 'arun') target = profiles.find(p => p.email === 'arun@college.edu');
    else if (userType === 'admin') target = profiles.find(p => p.role === 'admin');

    if (target) {
      localStore.saveSession(target);
      return { user: target };
    }
    throw new Error('Demo account not found.');
  },

  // Get current active session
  async getCurrentUser() {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return profile ? { ...user, ...profile } : user;
    }
    return localStore.getSession();
  },

  // Update Student Profile (User can only update their own)
  async updateProfile(userId, profileData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          department: profileData.department,
          year: profileData.year,
          semester: profileData.semester,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const profiles = localStore.getProfiles();
    const index = profiles.findIndex(p => p.id === userId);
    if (index === -1) throw new Error('Student profile not found');
    
    profiles[index] = {
      ...profiles[index],
      ...profileData,
      updated_at: new Date().toISOString()
    };
    localStore.saveProfiles(profiles);
    localStore.saveSession(profiles[index]);
    return profiles[index];
  }
};
