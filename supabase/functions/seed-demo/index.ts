import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting demo data seeding...');
    
    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    let seeded = false;

    // Check if badges table is empty and seed if needed
    const { data: badgesData, error: badgesCheckError } = await supabase
      .from('badges')
      .select('id')
      .limit(1);

    if (badgesCheckError) {
      console.error('Error checking badges:', badgesCheckError);
    } else if (!badgesData || badgesData.length === 0) {
      console.log('Seeding badges...');
      await supabase.from('badges').insert([
        { badge_id: 'demo_explorer', name: 'Demo Explorer', description: 'Explored the demo data', icon: '🔍', points_required: 5, category: 'exploration' }
      ]);
      seeded = true;
    }

    // Check and seed user_points
    const { data: pointsData } = await supabase.from('user_points').select('id').limit(1);
    if (!pointsData || pointsData.length === 0) {
      console.log('Seeding user_points...');
      await supabase.from('user_points').insert([
        { user_identifier: 'demo_user_001', total_points: 150, current_level: 2 },
        { user_identifier: 'demo_user_002', total_points: 500, current_level: 3 },
        { user_identifier: 'demo_user_003', total_points: 1200, current_level: 5 }
      ]);
      seeded = true;
    }

    // Check and seed points_history
    const { data: historyData } = await supabase.from('points_history').select('id').limit(1);
    if (!historyData || historyData.length === 0) {
      console.log('Seeding points_history...');
      await supabase.from('points_history').insert([
        { user_identifier: 'demo_user_001', action_type: 'tip_read', points_earned: 10 },
        { user_identifier: 'demo_user_001', action_type: 'simulation_run', points_earned: 20 },
        { user_identifier: 'demo_user_002', action_type: 'first_simulation', points_earned: 50 },
        { user_identifier: 'demo_user_002', action_type: 'advanced_dashboard', points_earned: 30 },
        { user_identifier: 'demo_user_003', action_type: 'quiz_completed', points_earned: 40 }
      ]);
      seeded = true;
    }

    // Check and seed session_time
    const { data: sessionData } = await supabase.from('session_time').select('id').limit(1);
    if (!sessionData || sessionData.length === 0) {
      console.log('Seeding session_time...');
      const now = new Date();
      await supabase.from('session_time').insert([
        { 
          session_id: 'demo_session_001', 
          start_time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now.getTime() - 105 * 60 * 1000).toISOString(),
          duration_seconds: 900, 
          page_path: '/', 
          user_identifier: 'demo_user_001' 
        },
        { 
          session_id: 'demo_session_002', 
          start_time: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now.getTime() - 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          duration_seconds: 1800, 
          page_path: '/dashboard', 
          user_identifier: 'demo_user_002' 
        },
        { 
          session_id: 'demo_session_003', 
          start_time: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
          duration_seconds: 1800, 
          page_path: '/simulation', 
          user_identifier: 'demo_user_003' 
        }
      ]);
      seeded = true;
    }

    // Check and seed session_points_summary
    const { data: summaryData } = await supabase.from('session_points_summary').select('id').limit(1);
    if (!summaryData || summaryData.length === 0) {
      console.log('Seeding session_points_summary...');
      await supabase.from('session_points_summary').insert([
        { 
          session_id: 'demo_session_001', 
          user_identifier: 'demo_user_001', 
          total_points: 80, 
          actions_performed: 6, 
          duration_seconds: 900, 
          milestone_reached: 'Bronze Beginner', 
          unique_interactions: { actions: ['tip_read', 'simulation_run'] }
        },
        { 
          session_id: 'demo_session_002', 
          user_identifier: 'demo_user_002', 
          total_points: 260, 
          actions_performed: 12, 
          duration_seconds: 1800, 
          milestone_reached: 'Silver Learner', 
          unique_interactions: { actions: ['first_simulation', 'advanced_dashboard'] }
        },
        { 
          session_id: 'demo_session_003', 
          user_identifier: 'demo_user_003', 
          total_points: 540, 
          actions_performed: 18, 
          duration_seconds: 1800, 
          milestone_reached: 'Gold Planner', 
          unique_interactions: { actions: ['quiz_completed', 'comparison'] }
        }
      ]);
      seeded = true;
    }

    // Check and seed simulation_logs
    const { data: simData } = await supabase.from('simulation_logs').select('id').limit(1);
    if (!simData || simData.length === 0) {
      console.log('Seeding simulation_logs...');
      await supabase.from('simulation_logs').insert([
        { age: 35, sex: 'male', salary_amount: 5000, illness_included: false, account_funds: 10000, sub_account_funds: 5000, actual_pension: 2500, real_pension: 2300, expected_pension: 2800, postal_code: '00-001' },
        { age: 45, sex: 'female', salary_amount: 6000, illness_included: true, account_funds: 15000, sub_account_funds: 8000, actual_pension: 3200, real_pension: 2900, expected_pension: 3500, postal_code: '00-002' },
        { age: 55, sex: 'male', salary_amount: 7000, illness_included: false, account_funds: 25000, sub_account_funds: 12000, actual_pension: 4100, real_pension: 3800, expected_pension: 4500, postal_code: '00-003' }
      ]);
      seeded = true;
    }

    // Check and seed quizzes
    const { data: quizData } = await supabase.from('quizzes').select('id').limit(1);
    if (!quizData || quizData.length === 0) {
      console.log('Seeding quizzes...');
      await supabase.from('quizzes').insert([
        { 
          quiz_type: 'onboarding', 
          user_name: 'Demo User 1', 
          user_email: 'demo1@example.com', 
          total_questions: 5, 
          score: 4, 
          answers: { q1: 'a', q2: 'b', q3: 'c', q4: 'a', q5: 'd' }, 
          quiz_data: { timeSpent: 120 }
        },
        { 
          quiz_type: 'knowledge', 
          user_name: 'Demo User 2', 
          user_email: 'demo2@example.com', 
          total_questions: 8, 
          score: 6, 
          answers: { q1: 'true', q2: 'false' }, 
          quiz_data: { category: 'pension_basics' }
        }
      ]);
      seeded = true;
    }

    // Check and seed prize_redeems
    const { data: prizeData } = await supabase.from('prize_redeems').select('id').limit(1);
    if (!prizeData || prizeData.length === 0) {
      console.log('Seeding prize_redeems...');
      await supabase.from('prize_redeems').insert([
        { user_email: 'demo1@example.com', session_points: 120, badges_count: 2, allow_contact: true },
        { user_email: 'demo2@example.com', session_points: 350, badges_count: 4, allow_contact: false }
      ]);
      seeded = true;
    }

    console.log(`Demo data seeding complete. Seeded: ${seeded}`);

    return new Response(
      JSON.stringify({ success: true, seeded }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in seed-demo function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
